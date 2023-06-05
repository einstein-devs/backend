/*
  Warnings:

  - You are about to drop the column `codigo` on the `redefinicaoSenha` table. All the data in the column will be lost.
  - Added the required column `utilizado` to the `redefinicaoSenha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "redefinicaoSenha" DROP COLUMN "codigo",
ADD COLUMN     "utilizado" BOOLEAN NOT NULL;
