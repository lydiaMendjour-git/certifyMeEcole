/*
  Warnings:

  - A unique constraint covering the columns `[diplomaHash]` on the table `Diplome` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Diplome_diplomaHash_key" ON "Diplome"("diplomaHash");
