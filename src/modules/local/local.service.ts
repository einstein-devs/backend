import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindManyLocaisDto } from './dto/find-many-locais.dto';
import { LocalDto } from './dto/local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Injectable()
export class LocalService {
    constructor(private prisma: PrismaService) {}

    async findMany(filtros: FindManyLocaisDto) {
        try {
            return await this.prisma.local.findMany({
                where: {
                    titulo: {
                        contains: filtros.search,
                        mode: 'insensitive',
                    },
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar os locais!',
            );
        }
    }

    async findUnique(id: string) {
        try {
            return await this.prisma.local.findUnique({
                where: {
                    id: id,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar o local!',
            );
        }
    }

    async create(localData: LocalDto) {
        try {
            console.log(localData);
            return await this.prisma.local.create({
                data: {
                    titulo: localData.titulo,
                    descricao: localData.descricao,
                },
            });
        } catch (_) {
            console.log('' + _);
            throw new InternalServerErrorException(
                'Ocorreu um erro ao criar um novo local!',
            );
        }
    }

    async update(id: string, data: UpdateLocalDto) {
        try {
            return await this.prisma.local.update({
                where: {
                    id,
                },
                data: data,
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao atualizar o local!',
            );
        }
    }

    async delete(id: string) {
        try {
            await this.prisma.local.delete({
                where: {
                    id,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao excluir o local!',
            );
        }
    }
}

export default LocalService;
