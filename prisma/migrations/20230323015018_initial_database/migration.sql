-- CreateEnum
CREATE TYPE "CargoPosicao" AS ENUM ('ALUNO', 'COORDENADOR', 'DIRETOR');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "senha" VARCHAR(90) NOT NULL,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP NOT NULL,
    "dataExclusao" TIMESTAMP,
    "cargoId" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ementa" TEXT,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_curso" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cursoId" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" TEXT NOT NULL,
    "posicao" "CargoPosicao" NOT NULL,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(40) NOT NULL,
    "descricao" VARCHAR(255),
    "codigo" VARCHAR(12),
    "dataHoraInicio" TIMESTAMP NOT NULL,
    "dataHoraTermino" TIMESTAMP NOT NULL,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255),
    "urlImagem" TEXT,
    "dataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificado" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "dataEmissao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presenca" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "dataInscricao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPresenca" TIMESTAMP,

    CONSTRAINT "presenca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_codigo_key" ON "usuario"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_posicao_key" ON "cargo"("posicao");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_curso" ADD CONSTRAINT "usuario_curso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_curso" ADD CONSTRAINT "usuario_curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
