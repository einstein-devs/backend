-- DropForeignKey
ALTER TABLE "curso" DROP CONSTRAINT "curso_id_coordenador_fkey";

-- AlterTable
ALTER TABLE "curso" ALTER COLUMN "id_coordenador" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_id_coordenador_fkey" FOREIGN KEY ("id_coordenador") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
