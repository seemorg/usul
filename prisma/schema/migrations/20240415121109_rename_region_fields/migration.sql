/*
  Warnings:

  - You are about to drop the column `arabic_name` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `current_name` on the `Region` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Region" DROP COLUMN "arabic_name",
DROP COLUMN "current_name",
ADD COLUMN     "arabicName" TEXT,
ADD COLUMN     "currentName" TEXT;
