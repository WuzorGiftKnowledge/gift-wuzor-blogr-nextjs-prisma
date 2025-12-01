-- AlterTable
ALTER TABLE "PrayerPoint" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Testimony" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
