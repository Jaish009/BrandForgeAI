
import cloudinary from "../config/cloudinary.config";
import { Env } from "../config/env.config";
import { prisma } from "../lib/prisma";
import { BadRequestException, InternalServerException, NotFoundException } from "../utils/app-error";
import { CreateListingType } from "../validators/listing.validator";
import { SYSTEM_PROMPT } from "../utils/prompt";
import slugify from "slugify";

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-");



export const createListingService = async (userId: string, data: CreateListingType) => {
  try {
    const template = await prisma.product.findUnique({
      where: { id: data.templateId }
    });
    if (!template) throw new NotFoundException("Template not found");
    if (!template.template) throw new BadRequestException("Product not template");
    if (!template.basePrice) throw new BadRequestException("Product not template");

    if (data.sellingPrice < template.basePrice) {
      throw new BadRequestException(`Selling price must be at least ${template.basePrice}`);
    }

    // Upload the artwork
    const uploaded = await cloudinary.uploader.upload(
      data.artworkUrl, {
      folder: "Brandforge-ai/artworks",
      resource_type: "image"
    }
    )

    // Generate slug
    const slug = slugify(data.title, {
      lower: true,
      strict: true
    }) + "-" + Date.now();

    const listing = await prisma.listing.create({
      data: {
        userId,
        templateId: data.templateId,
        title: data.title,
        description: data.description,
        sellingPrice: data.sellingPrice,
        slug,
        artworkUrl: uploaded.secure_url,
        artworkPlacementTop: data.artworkPlacement.top,
        artworkPlacementLeft: data.artworkPlacement.left,
        artworkPlacementWidth: data.artworkPlacement.width,
        artworkPlacementHeight: data.artworkPlacement.height,
        artworkPlacementRefDisplayWidth: data.artworkPlacement.refDisplayWidth,
        colors: {
          create: data.colorIds.map((colorId) => ({
            colorId,
          }))
        }
      }
    })

    return { listing }

  } catch (error) {
    throw new InternalServerException("Internal error")
  }
}


export const getUserListingsService = async (userId: string) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId },
      include: {
        template: true,
        colors: {
          include: {
            color: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    const mappedListings = listings.map((listing) => {
      const colors = listing.colors.map((lc) => ({
        ...lc.color,
        mockupImageUrl: lc.color.name
          ? `${Env.BASE_URL}/api/listing/mockup/${listing.slug}/${toSlug(lc.color.name)}.jpg`
          : null
      }));

      return {
        ...listing,
        templateName: listing.template?.name,
        colorIds: colors
      }
    });

    return { listings: mappedListings }
  } catch (error) {
    throw new InternalServerException("Internal Error")
  }
}

export const getListingBySlugService = async (slug: string) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        template: true,
        colors: {
          include: {
            color: true
          }
        }
      }
    });

    if (!listing) throw new NotFoundException("Listing not found")

    const colors = listing.colors.map((lc) => ({
      ...lc.color,
      mockupImageUrl: lc.color.name
        ? `${Env.BASE_URL}/api/listing/mockup/${slug}/${toSlug(lc.color.name)}.jpg`
        : null
    }));

    const template = listing.template;

    return {
      listing: {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        description: listing.description,
        sellingPrice: listing.sellingPrice,
        templateName: template?.name,
        templateBody: template?.body,
        sizes: template?.sizes,
        artworkUrl: listing.artworkUrl,
        artworkPlacementTop: listing.artworkPlacementTop,
        artworkPlacementLeft: listing.artworkPlacementLeft,
        artworkPlacementWidth: listing.artworkPlacementWidth,
        artworkPlacementHeight: listing.artworkPlacementHeight,
        artworkPlacementRefDisplayWidth: listing.artworkPlacementRefDisplayWidth,
        colorIds: colors
      }
    }

  } catch (error) {
    throw new InternalServerException("Internal server error")
  }
}


export const getMockupUrlService = async (slug: string, colorName: string) => {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      colors: {
        include: {
          color: true
        }
      },
      template: true
    }
  });

  if (!listing) throw new NotFoundException("Listing not found");

  const matchedColor = listing.colors.find(
    (lc) => toSlug(lc.color.name) === colorName.replace(".jpg", ""))

  if (!matchedColor) throw new NotFoundException("Color not found");

  const template = listing.template;
  const printableArea = {
    top: template.printableAreaTop ?? 0,
    left: template.printableAreaLeft ?? 0,
    width: template.printableAreaWidth ?? 0,
    height: template.printableAreaHeight ?? 0,
  };

  const getPublicId = (url: string) =>
    url.split("/upload/")[1]
      .replace(/^v\d+\//, "") // remove version prefix e.g. v1773951553/
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/\//g, ":"); // slashes → colons

  const artworkPulicId = getPublicId(listing.artworkUrl);
  const mockupPublicId = getPublicId(matchedColor.color.mockupUrl);

  const refDisplayWidth = listing.artworkPlacementRefDisplayWidth;

  const mockup_width = 900;

  const scale = mockup_width / (refDisplayWidth ?? 662)

  const url = cloudinary.url(matchedColor.color.mockupUrl, {
    type: "fetch",
    transformation: [
      { overlay: artworkPulicId },
      {
        width: Math.round(printableArea.width * scale),
        height: Math.round(printableArea.height * scale),
        crop: "fit"
      },
      {
        flags: "layer_apply",
        gravity: "north_west",
        x: Math.round(printableArea.left * scale),
        y: Math.round(printableArea.top * scale)
      }
    ],
    format: "jpg",
    quality: 90
  })

  console.log("Generated Mockup URL:", url);
  return url


}

export const generateArtworkService = async (prompt: string) => {
  console.log("Entering generateArtworkService with prompt:", prompt);
  try {
    // Step 1: Refine the prompt using Pollinations.ai text API (free)
    let text = prompt;
    try {
      const textRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt }
          ],
          model: "openai",
        }),
      });
      if (textRes.ok) {
        text = await textRes.text();
        console.log("AI Prompt Refinement Success:", text);
      }
    } catch (aiError: any) {
      console.warn("AI Prompt Refinement failed, falling back to original prompt:", aiError.message);
    }

    // Step 2: Generate image using Pollinations.ai (free, no API key needed)
    const encodedPrompt = encodeURIComponent(text.trim());
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true&model=flux`;

    console.log("Fetching image from Pollinations...");
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error("Pollinations image generation failed");

    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    // Step 3: Upload generated image to Cloudinary
    const uploadImg = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`, {
      folder: "Brandforge-ai/artworks",
      resource_type: "image"
    });

    // Step 4: Remove background using remove.bg
    const formData = new FormData();
    formData.append("image_url", uploadImg.secure_url);
    formData.append("size", "auto");

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": Env.REMOVE_BG_API_KEY! },
      body: formData,
    });

    if (!bgRes.ok) {
      throw new InternalServerException("Background removal failed");
    }

    const bgBuffer = Buffer.from(await bgRes.arrayBuffer());

    // Step 5: Upload final image to Cloudinary
    const finalUpload = await cloudinary.uploader.upload(
      `data:image/png;base64,${bgBuffer.toString("base64")}`, {
      folder: "Brandforge-ai/artworks",
      resource_type: "image"
    });

    return { artworkUrl: finalUpload.secure_url };

  } catch (error: any) {
    console.log("Artwork Generation Error Details:", error.message || error);
    throw new InternalServerException(`Failed to generate artwork: ${error.message || "Unknown error"}`);
  }
}
