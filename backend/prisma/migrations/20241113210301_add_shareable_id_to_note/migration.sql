/*
  Warnings:

  - A unique constraint covering the columns `[shareableId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "shareableId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Note_shareableId_key" ON "Note"("shareableId");
