-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "extraProperties" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "extraProperties" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "extraProperties" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "AdvancedGenre" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "transliteration" TEXT,
    "extraProperties" JSONB NOT NULL DEFAULT '{}',
    "numberOfBooks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AdvancedGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedGenreName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "AdvancedGenreName_pkey" PRIMARY KEY ("genreId","locale")
);

-- CreateTable
CREATE TABLE "_AdvancedGenreToBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedGenre_slug_key" ON "AdvancedGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_AdvancedGenreToBook_AB_unique" ON "_AdvancedGenreToBook"("A", "B");

-- CreateIndex
CREATE INDEX "_AdvancedGenreToBook_B_index" ON "_AdvancedGenreToBook"("B");

-- AddForeignKey
ALTER TABLE "AdvancedGenreName" ADD CONSTRAINT "AdvancedGenreName_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "AdvancedGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvancedGenreToBook" ADD CONSTRAINT "_AdvancedGenreToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvancedGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvancedGenreToBook" ADD CONSTRAINT "_AdvancedGenreToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
