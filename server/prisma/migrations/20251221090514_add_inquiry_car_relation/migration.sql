-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
