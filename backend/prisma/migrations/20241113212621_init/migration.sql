/*
  Warnings:

  - You are about to drop the column `shareableId` on the `Note` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Note_shareableId_key";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "shareableId";
