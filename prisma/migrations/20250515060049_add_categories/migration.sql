/*
  Warnings:

  - You are about to drop the `Machine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Machine";

-- CreateTable
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "specs" JSONB NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_slug_key" ON "machines"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
