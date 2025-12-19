/*
  Warnings:

  - You are about to drop the column `bio` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "bio";

-- CreateTable
CREATE TABLE "AuthorBio" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorBio_pkey" PRIMARY KEY ("authorId","locale")
);

-- AddForeignKey
ALTER TABLE "AuthorBio" ADD CONSTRAINT "AuthorBio_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
