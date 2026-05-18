import stripeClient from "../config/stripe.config";
import { prisma } from "../lib/prisma";
import { BadRequestException, InternalServerException, NotFoundException } from "../utils/app-error";
import { CreateOrderType } from "../validators/order.validator";
import { Env } from "../config/env.config";


export const createOrderService = async (
  data: CreateOrderType
) => {
  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId },
    include: {
      colors: {
        include: {
          color: true
        }
      }
    }
  });
  if (!listing) throw new NotFoundException("Listing not found");

  const isColorValid = listing.colors.some((lc) => lc.colorId === data.colorId);
  if (!isColorValid) throw new BadRequestException("Color is invalid")

  const order = await prisma.order.create({
    data: {
      listingId: data.listingId,
      colorId: data.colorId,
      size: data.size,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      amount: listing.sellingPrice,
      isPaid: false,
      status: "pending",
      shippingStreet: data.shippingAddress.street,
      shippingCity: data.shippingAddress.city,
      shippingPostalCode: data.shippingAddress.postalCode,
      shippingCountry: data.shippingAddress.country,
      shippingState: data.shippingAddress.state,
      shippingPhoneNumber: data.shippingAddress.phoneNumber,
    }
  })

  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    customer_email: data.customerEmail,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: listing.title },
        unit_amount: Math.round(listing.sellingPrice * 100),
      },
      quantity: 1,
    }],
    metadata: {
      orderId: order.id
    },
    success_url: `${Env.FRONTEND_ORIGIN}/thank-you?orderId=${order.id}`,
    cancel_url: `${Env.FRONTEND_ORIGIN}/listing/${listing.slug}?error=true`,
  })

  if (!session.url) {
    await prisma.order.delete({ where: { id: order.id } })
    throw new InternalServerException("Failed to create checkout session")
  }

  return { url: session.url }
}


export const getUserOrdersService = async (userId: string) => {
  const listings = await prisma.listing.findMany({
    where: { userId },
    select: { id: true }
  });
  const listingIds = listings.map((listing) => listing.id);

  const orders = await prisma.order.findMany({
    where: {
      listingId: {
        in: listingIds
      }
    },
    include: {
      listing: {
        select: {
          title: true,
          slug: true,
          artworkUrl: true
        }
      },
      color: {
        select: {
          name: true,
          color: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return orders
}
