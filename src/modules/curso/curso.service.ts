import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindManyCursosDto } from './dtos/find-many-cursos.dto';

@Injectable()
export class CursoService {
    constructor(private prisma: PrismaService) {}

    async findMany(filtros: FindManyCursosDto) {
        try {
            const cursos = await this.prisma.curso.findMany({
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

    // async findUnique(id: string) {
    //     try {
    //         return await this.prisma.local.findUnique({
    //             where: {
    //                 id: id,
    //             },
    //         });
    //     } catch {
    //         throw new InternalServerErrorException(
    //             'Ocorreu um erro ao buscar o local!',
    //         );
    //     }
    // }

    // async create(localData: LocalDto) {
    //     try {
    //         console.log(localData);
    //         return await this.prisma.local.create({
    //             data: {
    //                 titulo: localData.titulo,
    //                 descricao: localData.descricao,
    //             },
    //         });
    //     } catch (_) {
    //         console.log('' + _);
    //         throw new InternalServerErrorException(
    //             'Ocorreu um erro ao criar um novo local!',
    //         );
    //     }
    // }

    // async update(id: string, data: UpdateLocalDto) {
    //     try {
    //         return await this.prisma.local.update({
    //             where: {
    //                 id,
    //             },
    //             data: data,
    //         });
    //     } catch {
    //         throw new InternalServerErrorException(
    //             'Ocorreu um erro ao atualizar o local!',
    //         );
    //     }
    // }

    // async delete(id: string) {
    //     try {
    //         await this.prisma.local.delete({
    //             where: {
    //                 id,
    //             },
    //         });
    //     } catch {
    //         throw new InternalServerErrorException(
    //             'Ocorreu um erro ao excluir o local!',
    //         );
    //     }
    // }
}
