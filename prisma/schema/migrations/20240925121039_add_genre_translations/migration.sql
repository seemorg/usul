/*
  Warnings:

  - You are about to drop the column `name` on the `Genre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "name",
ADD COLUMN     "transliteration" TEXT;

-- CreateTable
CREATE TABLE "GenreName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "GenreName_pkey" PRIMARY KEY ("genreId","locale")
);

-- AddForeignKey
ALTER TABLE "GenreName" ADD CONSTRAINT "GenreName_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
