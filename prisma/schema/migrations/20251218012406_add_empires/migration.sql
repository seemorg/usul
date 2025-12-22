-- CreateTable
CREATE TABLE "Empire" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "numberOfAuthors" INTEGER NOT NULL DEFAULT 0,
    "numberOfBooks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Empire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmpireName" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "empireId" TEXT NOT NULL,

    CONSTRAINT "EmpireName_pkey" PRIMARY KEY ("empireId","locale")
);

-- CreateTable
CREATE TABLE "EmpireOverview" (
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "empireId" TEXT NOT NULL,

    CONSTRAINT "EmpireOverview_pkey" PRIMARY KEY ("empireId","locale")
);

-- CreateTable
CREATE TABLE "_AuthorToRegion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToRegion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AuthorToEmpire" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToEmpire_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RegionToEmpire" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RegionToEmpire_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empire_slug_key" ON "Empire"("slug");

-- CreateIndex
CREATE INDEX "_AuthorToRegion_B_index" ON "_AuthorToRegion"("B");

-- CreateIndex
CREATE INDEX "_AuthorToEmpire_B_index" ON "_AuthorToEmpire"("B");

-- CreateIndex
CREATE INDEX "_RegionToEmpire_B_index" ON "_RegionToEmpire"("B");

-- AddForeignKey
ALTER TABLE "EmpireName" ADD CONSTRAINT "EmpireName_empireId_fkey" FOREIGN KEY ("empireId") REFERENCES "Empire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpireOverview" ADD CONSTRAINT "EmpireOverview_empireId_fkey" FOREIGN KEY ("empireId") REFERENCES "Empire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToRegion" ADD CONSTRAINT "_AuthorToRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToRegion" ADD CONSTRAINT "_AuthorToRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToEmpire" ADD CONSTRAINT "_AuthorToEmpire_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToEmpire" ADD CONSTRAINT "_AuthorToEmpire_B_fkey" FOREIGN KEY ("B") REFERENCES "Empire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegionToEmpire" ADD CONSTRAINT "_RegionToEmpire_A_fkey" FOREIGN KEY ("A") REFERENCES "Empire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegionToEmpire" ADD CONSTRAINT "_RegionToEmpire_B_fkey" FOREIGN KEY ("B") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
