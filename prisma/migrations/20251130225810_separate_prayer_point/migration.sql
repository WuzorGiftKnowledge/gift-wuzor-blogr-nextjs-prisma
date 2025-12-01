/*
  Warnings:

  - You are about to drop the column `prayerPoint` on the `Testimony` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Testimony" DROP COLUMN "prayerPoint";

-- CreateTable
CREATE TABLE "PrayerPoint" (
    "id" SERIAL NOT NULL,
    "prayerPoint" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerPoint_pkey" PRIMARY KEY ("id")
);
