-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "buyerId" TEXT;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
