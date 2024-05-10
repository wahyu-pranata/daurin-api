/*
  Warnings:

  - You are about to drop the column `image` on the `Order` table. All the data in the column will be lost.
  - Added the required column `image` to the `ItemsOnOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ItemsOnOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemsOnOrders" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "image",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "shippingCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transactionProof" TEXT NOT NULL DEFAULT '';
