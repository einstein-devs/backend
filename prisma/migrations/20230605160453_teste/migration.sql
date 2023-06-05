/*
  Warnings:

  - You are about to drop the `redefinicaoSenha` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "redefinicaoSenha" DROP CONSTRAINT "redefinicaoSenha_usuarioId_fkey";

-- DropTable
DROP TABLE "redefinicaoSenha";

-- CreateTable
CREATE TABLE "redefinicao_senha" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "utilizado" BOOLEAN NOT NULL,
    "data_limite" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_emissao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redefinicao_senha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "redefinicao_senha" ADD CONSTRAINT "redefinicao_senha_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
