import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCentroDto } from './dtos/create-centro.dto';
import { FindManyCentrosDto } from './dtos/find-many-centros.dto';

@Injectable()
export class CentroService {
    constructor(private prisma: PrismaService) {}

    async findMany(filtros: FindManyCentrosDto, usuarioId: string) {
        try {
            const usuario = await this.prisma.usuario.findUnique({
                include: {
                    cargo: true,
                },
                where: {
                    id: usuarioId,
                },
            });

            let centros = [];

            if (usuario.cargo.posicao == 'DIRETOR') {
                centros = await this.prisma.centro.findMany({
                    include: {
                        curso: true,
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
                centros = await this.prisma.centro.findMany({
                    include: {
                        curso: true,
                        _count: true,
                    },
                    where: {
                        nome: {
                            contains: filtros.search,
                            mode: 'insensitive',
                        },
                        curso: {
                            some: {
                                coordenadorId: usuarioId,
                            },
                        },
                    },
                });
            }

            return centros.map(centro => {
                return {
                    ...centro,
                    quantidadeCursos: centro._count.curso,
                };
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar os cursos!',
            );
        }
    }

    async create(createCentro: CreateCentroDto, diretorId: string) {
        try {
            return await this.prisma.centro.create({
                data: {
                    nome: createCentro.nome,
                    diretorId: diretorId,
                },
            });
        } catch (_) {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao criar um novo centro!',
            );
        }
    }
}
