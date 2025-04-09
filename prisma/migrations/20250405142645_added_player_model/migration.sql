/*
  Warnings:

  - A unique constraint covering the columns `[teamName]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "x" DOUBLE PRECISION NOT NULL DEFAULT 705,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "anim" TEXT NOT NULL DEFAULT 'adam_idle_down',
    "readyToConnect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamName_key" ON "Team"("teamName");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_name_fkey" FOREIGN KEY ("name") REFERENCES "Team"("teamName") ON DELETE RESTRICT ON UPDATE CASCADE;
