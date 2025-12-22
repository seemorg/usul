/*
  Warnings:

  - You are about to drop the column `flags` on the `Book` table. All the data in the column will be lost.
  - The `physicalDetails` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "flags",
DROP COLUMN "physicalDetails",
ADD COLUMN     "physicalDetails" JSONB;
