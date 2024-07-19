/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `age` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "birthDate",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "sex" "Gender" NOT NULL;
