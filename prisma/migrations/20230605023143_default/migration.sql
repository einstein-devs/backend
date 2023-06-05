-- CreateTable
CREATE TABLE "redefinicaoSenha" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "data_emissao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redefinicaoSenha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "redefinicaoSenha" ADD CONSTRAINT "redefinicaoSenha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
