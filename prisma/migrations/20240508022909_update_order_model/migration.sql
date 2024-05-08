-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'OnProgress', 'Success', 'Canceled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Pending';
