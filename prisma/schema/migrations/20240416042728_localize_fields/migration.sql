/*
  Warnings:

  - You are about to drop the column `otherArabicNames` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `otherLatinNames` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `primaryArabicName` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `primaryLatinName` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `otherArabicNames` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `otherLatinNames` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `primaryArabicName` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `primaryLatinName` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `cityCode` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `arabicName` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `currentName` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Region` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "otherArabicNames",
DROP COLUMN "otherLatinNames",
DROP COLUMN "primaryArabicName",
DROP COLUMN "primaryLatinName";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "otherArabicNames",
DROP COLUMN "otherLatinNames",
DROP COLUMN "primaryArabicName",
DROP COLUMN "primaryLatinName";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "cityCode";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "arabicName",
DROP COLUMN "currentName",
DROP COLUMN "name",
DROP COLUMN "overview";

-- CreateTable
CREATE TABLE "AuthorPrimaryName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorPrimaryName_pkey" PRIMARY KEY ("authorId","locale")
);

-- CreateTable
CREATE TABLE "AuthorOtherNames" (
    "locale" TEXT NOT NULL,
    "texts" TEXT[],
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorOtherNames_pkey" PRIMARY KEY ("authorId","locale")
);

-- CreateTable
CREATE TABLE "BookPrimaryName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookPrimaryName_pkey" PRIMARY KEY ("bookId","locale")
);

-- CreateTable
CREATE TABLE "BookOtherNames" (
    "locale" TEXT NOT NULL,
    "texts" TEXT[],
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookOtherNames_pkey" PRIMARY KEY ("bookId","locale")
);

-- CreateTable
CREATE TABLE "LocationCityName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "LocationCityName_pkey" PRIMARY KEY ("locationId","locale")
);

-- CreateTable
CREATE TABLE "RegionCurrentName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "RegionCurrentName_pkey" PRIMARY KEY ("regionId","locale")
);

-- CreateTable
CREATE TABLE "RegionName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "RegionName_pkey" PRIMARY KEY ("regionId","locale")
);

-- CreateTable
CREATE TABLE "RegionOverview" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "RegionOverview_pkey" PRIMARY KEY ("regionId","locale")
);

-- AddForeignKey
ALTER TABLE "AuthorPrimaryName" ADD CONSTRAINT "AuthorPrimaryName_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOtherNames" ADD CONSTRAINT "AuthorOtherNames_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrimaryName" ADD CONSTRAINT "BookPrimaryName_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOtherNames" ADD CONSTRAINT "BookOtherNames_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationCityName" ADD CONSTRAINT "LocationCityName_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionCurrentName" ADD CONSTRAINT "RegionCurrentName_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionName" ADD CONSTRAINT "RegionName_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionOverview" ADD CONSTRAINT "RegionOverview_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
