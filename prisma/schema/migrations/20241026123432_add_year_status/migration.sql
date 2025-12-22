-- CreateEnum
CREATE TYPE "AuthorYearStatus" AS ENUM ('Unknown', 'Alive');

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "yearStatus" "AuthorYearStatus",
ALTER COLUMN "year" DROP NOT NULL;
