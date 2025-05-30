-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "specs" JSONB NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_slug_key" ON "Machine"("slug");
