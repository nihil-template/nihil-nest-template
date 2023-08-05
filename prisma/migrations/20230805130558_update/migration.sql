/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `user` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `user_auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "hashedPassword";

-- AlterTable
ALTER TABLE "user_auth" ADD COLUMN     "hashedPassword" TEXT NOT NULL;
