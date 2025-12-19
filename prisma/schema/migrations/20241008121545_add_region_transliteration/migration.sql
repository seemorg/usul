-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "transliteration" TEXT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "currentNameTransliteration" TEXT,
ADD COLUMN     "transliteration" TEXT;
