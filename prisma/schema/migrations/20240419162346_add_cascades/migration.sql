-- DropForeignKey
ALTER TABLE "AuthorBio" DROP CONSTRAINT "AuthorBio_authorId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorOtherNames" DROP CONSTRAINT "AuthorOtherNames_authorId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorPrimaryName" DROP CONSTRAINT "AuthorPrimaryName_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BookOtherNames" DROP CONSTRAINT "BookOtherNames_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookPrimaryName" DROP CONSTRAINT "BookPrimaryName_bookId_fkey";

-- DropForeignKey
ALTER TABLE "LocationCityName" DROP CONSTRAINT "LocationCityName_locationId_fkey";

-- DropForeignKey
ALTER TABLE "RegionCurrentName" DROP CONSTRAINT "RegionCurrentName_regionId_fkey";

-- DropForeignKey
ALTER TABLE "RegionName" DROP CONSTRAINT "RegionName_regionId_fkey";

-- DropForeignKey
ALTER TABLE "RegionOverview" DROP CONSTRAINT "RegionOverview_regionId_fkey";

-- AddForeignKey
ALTER TABLE "AuthorBio" ADD CONSTRAINT "AuthorBio_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorPrimaryName" ADD CONSTRAINT "AuthorPrimaryName_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOtherNames" ADD CONSTRAINT "AuthorOtherNames_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrimaryName" ADD CONSTRAINT "BookPrimaryName_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOtherNames" ADD CONSTRAINT "BookOtherNames_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationCityName" ADD CONSTRAINT "LocationCityName_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionCurrentName" ADD CONSTRAINT "RegionCurrentName_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionName" ADD CONSTRAINT "RegionName_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionOverview" ADD CONSTRAINT "RegionOverview_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
