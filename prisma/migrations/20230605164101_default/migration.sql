-- CreateEnum
CREATE TYPE "CargoPosicao" AS ENUM ('ALUNO', 'COORDENADOR', 'DIRETOR');

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nome" VARCHAR(70) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "senha" TEXT NOT NULL,
    "id_cargo" UUID NOT NULL,
    "id_curso" UUID,
    "id_curso_coordenado" UUID,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP NOT NULL,
    "data_exclusao" TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curso" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(70) NOT NULL,
    "ementa" VARCHAR(100),
    "id_centro" UUID NOT NULL,
    "id_coordenador" UUID,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centro" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "id_diretor" UUID NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "centro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" UUID NOT NULL,
    "posicao" "CargoPosicao" NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(40) NOT NULL,
    "descricao" VARCHAR(255),
    "codigo" VARCHAR(12),
    "url_imagem" TEXT,
    "data_hora_inicio" TIMESTAMP NOT NULL,
    "data_hora_termino" TIMESTAMP NOT NULL,
    "id_local" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255),
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificado" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_evento" UUID NOT NULL,
    "data_emissao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presenca" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_evento" UUID NOT NULL,
    "data_inscricao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_presenca" TIMESTAMP,

    CONSTRAINT "presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redefinicao_senha" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "utilizado" BOOLEAN NOT NULL,
    "data_limite" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_emissao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redefinicao_senha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_codigo_key" ON "usuario"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "curso_id_coordenador_key" ON "curso"("id_coordenador");

-- CreateIndex
CREATE UNIQUE INDEX "centro_nome_key" ON "centro"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_posicao_key" ON "cargo"("posicao");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_cargo_fkey" FOREIGN KEY ("id_cargo") REFERENCES "cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_id_centro_fkey" FOREIGN KEY ("id_centro") REFERENCES "centro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_id_coordenador_fkey" FOREIGN KEY ("id_coordenador") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centro" ADD CONSTRAINT "centro_id_diretor_fkey" FOREIGN KEY ("id_diretor") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_id_local_fkey" FOREIGN KEY ("id_local") REFERENCES "local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redefinicao_senha" ADD CONSTRAINT "redefinicao_senha_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
