import { prisma } from './src/lib/prisma';

async function main() {
  const orderId = "cbf09426-8166-4588-b84e-d8ab657a3d1c"; // The ID from our previous check
  
  console.log(`Simulating successful payment for order: ${orderId}`);
  
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        status: "awaiting_shipment"
      }
    });
    
    console.log("Success! Order updated:");
    console.log(JSON.stringify(updatedOrder, null, 2));
  } catch (err) {
    console.error("Error updating order:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
