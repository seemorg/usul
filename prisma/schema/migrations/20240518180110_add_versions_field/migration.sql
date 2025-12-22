/*
  Warnings:

  - You are about to drop the column `versionIds` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "versionIds",
ADD COLUMN     "versions" JSONB[];
