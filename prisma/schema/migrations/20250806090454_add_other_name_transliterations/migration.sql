-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "otherNameTransliterations" TEXT[];

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "otherNameTransliterations" TEXT[];
