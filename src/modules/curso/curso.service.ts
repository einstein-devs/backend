import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dtos/create-curso.dto';
import { FindManyCursosDto } from './dtos/find-many-cursos.dto';

@Injectable()
export class CursoService {
    constructor(private prisma: PrismaService) {}

    async findMany(filtros: FindManyCursosDto, usuarioId: string) {
        try {
            const usuario = await this.prisma.usuario.findUnique({
                include: {
                    cargo: true,
                },
                where: {
                    id: usuarioId,
                },
            });

            let cursos;

            if (usuario.cargo.posicao == 'DIRETOR') {
                cursos = await this.prisma.curso.findMany({
                    include: {
                        centro: true,
                        _count: true,
                    },
                    where: {
                        nome: {
                            contains: filtros.search,
                            mode: 'insensitive',
                        },
                    },
                });
            } else {
                cursos = await this.prisma.curso.findMany({
                    include: {
                        centro: true,
                        _count: true,
                    },
                    where: {
                        nome: {
                            contains: filtros.search,
                            mode: 'insensitive',
                        },
                        coordenadorId: usuarioId,
                    },
                });
            }

            return cursos.map(curso => {
                return {
                    ...curso,
                    quantidadeAlunos: curso._count.usuario,
                };
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar os cursos!',
            );
        }
    }

    async create(createCurso: CreateCursoDto, usuarioId: string) {
        try {
            let coordenadorId: string;

            if (createCurso.coordenadorId) {
                coordenadorId = createCurso.coordenadorId;
            } else {
                coordenadorId = usuarioId;
            }

            return await this.prisma.curso.create({
                data: {
                    nome: createCurso.nome,
                    ementa: createCurso.ementa,
                    usuario: {
                        connect: { id: usuarioId },
                    },
                    coordenador: {
                        connect: {
                            id: coordenadorId,
                        },
                    },
                    centro: {
                        connect: {
                            id: createCurso.centroId,
                        },
                    },
                },
            });
        } catch (_) {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao criar um novo curso!',
            );
        }
    }
}
