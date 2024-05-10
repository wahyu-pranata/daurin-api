/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `amount` to the `ItemsOnOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemsOnOrders" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount";
