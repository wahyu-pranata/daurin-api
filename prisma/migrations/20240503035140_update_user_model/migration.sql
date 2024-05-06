-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agencyId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "agencyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
