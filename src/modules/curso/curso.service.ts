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

            let cursos = [];

            let where: any = {
                nome: {
                    contains: filtros.search,
                    mode: 'insensitive',
                },
            };

            if (filtros.somenteSemCoordenadores) {
                cursos = await this.prisma.curso.findMany({
                    include: {
                        centro: true,
                        _count: true,
                    },
                    where: {
                        ...where,
                        coordenadorId: null,
                    },
                });
            } else {
                if (usuario.cargo.posicao == 'DIRETOR') {
                    cursos = await this.prisma.curso.findMany({
                        include: {
                            centro: true,
                            _count: true,
                        },
                        where: {
                            ...where,
                        },
                    });
                } else {
                    cursos = await this.prisma.curso.findMany({
                        include: {
                            centro: true,
                            _count: true,
                        },
                        where: {
                            ...where,
                            coordenadorId: usuarioId,
                        },
                    });
                }
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
            let coordenadorId: string | null = null;

            if (createCurso.coordenadorId) {
                coordenadorId = createCurso.coordenadorId;
            }

            let dataCoordenador: any = {};

            if (coordenadorId) {
                dataCoordenador = {
                    coordenador: {
                        connect: {
                            id: coordenadorId,
                        },
                    },
                };
            }

            return await this.prisma.curso.create({
                data: {
                    nome: createCurso.nome,
                    ementa: createCurso.ementa ?? null,
                    centro: {
                        connect: {
                            id: createCurso.centroId,
                        },
                    },
                    ...dataCoordenador,
                },
            });
        } catch (_) {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao criar um novo curso!',
            );
        }
    }
}
