-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TSHIRT', 'HOODIE');

-- CreateEnum
CREATE TYPE "Section" AS ENUM ('catalog', 'featured');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'failed', 'awaiting_shipment', 'shipped', 'fulfilled');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "template" BOOLEAN NOT NULL DEFAULT false,
    "section" "Section" NOT NULL DEFAULT 'catalog',
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "displayUrl" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION,
    "baseUrl" TEXT,
    "sizes" TEXT[],
    "printableAreaTop" INTEGER,
    "printableAreaLeft" INTEGER,
    "printableAreaWidth" INTEGER,
    "printableAreaHeight" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "mockupUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "artworkUrl" TEXT NOT NULL,
    "artworkPlacementTop" DOUBLE PRECISION NOT NULL,
    "artworkPlacementLeft" DOUBLE PRECISION NOT NULL,
    "artworkPlacementWidth" DOUBLE PRECISION NOT NULL,
    "artworkPlacementHeight" DOUBLE PRECISION NOT NULL,
    "artworkPlacementRefDisplayWidth" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingColor" (
    "listingId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "ListingColor_pkey" PRIMARY KEY ("listingId","colorId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "shippingStreet" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingPostalCode" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingPhoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingColor" ADD CONSTRAINT "ListingColor_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingColor" ADD CONSTRAINT "ListingColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
