-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Testimony" (
    "id" SERIAL NOT NULL,
    "testimony" TEXT NOT NULL,
    "prayerPoint" TEXT,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimony_pkey" PRIMARY KEY ("id")
);
