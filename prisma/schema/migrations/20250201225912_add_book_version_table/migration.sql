-- CreateEnum
CREATE TYPE "BookVersionSource" AS ENUM ('Turath', 'Openiti', 'Pdf', 'External');

-- CreateTable
CREATE TABLE "BookVersion" (
    "id" TEXT NOT NULL,
    "source" "BookVersionSource" NOT NULL,
    "value" TEXT NOT NULL,
    "investigator" TEXT,
    "publisher" TEXT,
    "publisherLocation" TEXT,
    "editionNumber" TEXT,
    "publicationYear" TEXT,
    "aiSupported" BOOLEAN NOT NULL DEFAULT false,
    "keywordSupported" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "ocrBookId" TEXT,
    "splitsData" JSONB,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookVersion" ADD CONSTRAINT "BookVersion_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
