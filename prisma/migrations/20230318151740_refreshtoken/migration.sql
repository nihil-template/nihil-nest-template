/*
  Warnings:

  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `hashedRefreshToken` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;
