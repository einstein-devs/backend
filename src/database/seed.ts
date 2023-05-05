import { CargoPosicao, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

async function populateDatabase() {
  const prisma = new PrismaClient();

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
        posicao: CargoPosicao.COORDENADOR,
      },
      where: {
        posicao: CargoPosicao.COORDENADOR,
      },
      update: {},
    });

    await prisma.cargo.upsert({
      create: {
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

    await prisma.usuario.upsert({
      create: {
        nome: 'Eduardo Bertoli',
        email: 'eduardo@gmail.com',
        senha: passwordHashed,
        cargo: {
          connect: {
            posicao: CargoPosicao.DIRETOR,
          },
        },
        codigo: '1',
      },
      where: {
        codigo: '1',
      },
      update: {},
    });
  } catch (error) {
    console.log(`Erro ao criar usuario padrao: ${error}`);
  }

  try {
    await prisma.curso.create({
      data: {
        id: '0d3384b6-c0d8-4f24-b73f-006ef840a32e',
        nome: 'Tecnologo de Analise de Sistemas',
        ementa: 'Relacionado a informatica!',
      },
    });
    await prisma.usuario_curso.create({
      data: {
        curso: {
          connect: {
            id: '0d3384b6-c0d8-4f24-b73f-006ef840a32e',
          },
        },
        usuario: {
          connect: {
            codigo: '1',
          },
        },
      },
    });
  } catch (error) {
    console.log(`Erro ao criar cursos padroes: ${error}`);
  }
}

populateDatabase();
