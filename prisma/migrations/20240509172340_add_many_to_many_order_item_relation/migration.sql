/*
  Warnings:

  - You are about to drop the column `itemId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_itemId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "itemId";

-- CreateTable
CREATE TABLE "ItemsOnOrders" (
    "orderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemsOnOrders_pkey" PRIMARY KEY ("orderId","itemId")
);

-- AddForeignKey
ALTER TABLE "ItemsOnOrders" ADD CONSTRAINT "ItemsOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnOrders" ADD CONSTRAINT "ItemsOnOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
