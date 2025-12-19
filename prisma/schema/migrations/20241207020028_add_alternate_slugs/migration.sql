/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AuthorAlternateSlug" (
    "slug" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorAlternateSlug_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "BookAlternateSlug" (
    "slug" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookAlternateSlug_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorAlternateSlug_slug_key" ON "AuthorAlternateSlug"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookAlternateSlug_slug_key" ON "BookAlternateSlug"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- AddForeignKey
ALTER TABLE "AuthorAlternateSlug" ADD CONSTRAINT "AuthorAlternateSlug_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAlternateSlug" ADD CONSTRAINT "BookAlternateSlug_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
