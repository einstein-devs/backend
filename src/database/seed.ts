import { CargoPosicao, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

async function populateDatabase() {
    const prisma = new PrismaClient();
    const idDiretor = 'f55b791d-d716-4319-be55-2b07a30ef51b';
    const idCoordenador = '7a15432f-de94-4822-a535-03cd724e19c4';

    try {
        await prisma.cargo.upsert({
            create: {
                posicao: CargoPosicao.ALUNO,
            },
            where: {
                posicao: CargoPosicao.ALUNO,
            },
            update: {},
        });

        await prisma.cargo.upsert({
            create: {
                id: idCoordenador,
                posicao: CargoPosicao.COORDENADOR,
            },
            where: {
                posicao: CargoPosicao.COORDENADOR,
            },
            update: {},
        });

        await prisma.cargo.upsert({
            create: {
                id: idDiretor,
                posicao: CargoPosicao.DIRETOR,
            },
            where: {
                posicao: CargoPosicao.DIRETOR,
            },
            update: {},
        });
    } catch (error) {
        console.log(`Erro ao criar cargos padroes: ${error}`);
    }

    try {
        const password = '123456';
        const passwordHashed = await hash(password, 8);

        await prisma.usuario.createMany({
            data: [
                {
                    nome: 'Eduardo Bertoli',
                    email: 'eduardo@gmail.com',
                    codigo: '1',
                    senha: passwordHashed,
                    cargoId: idDiretor,
                },
            ],
        });
    } catch (error) {
        console.log(`Erro ao criar padrao: ${error}`);
    }
}

populateDatabase();
