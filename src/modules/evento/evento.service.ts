import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-evento-dto';
import { UpdateEventoDTO } from './dto/update-evento-dto';

@Injectable()
export class EventoService {
    constructor(private readonly prismaService: PrismaService) {}

    //Criação de eventos
    async createEvent(
        data: CreateEventDto,
        usuarioId: string,
        imagePath?: string,
    ) {
        const localExiste = await this.prismaService.local.findUnique({
            where: {
                id: data.localId,
            },
        });

        if (!localExiste) {
            throw new NotFoundException('O local não foi encontrado!');
        }

        if (data.dataHoraInicio.valueOf() > data.dataHoraTermino.valueOf()) {
            throw new BadRequestException(
                'A data hora inicio deve ser menor do que a data hora de termino!',
            );
        }

        const eventoExiste = await this.prismaService.evento.findFirst({
            where: {
                localId: data.localId,
                AND: {
                    dataHoraInicio: {
                        lte: data.dataHoraInicio,
                    },
                    dataHoraTermino: {
                        gt: data.dataHoraInicio,
                    },
                },
            },
        });

        if (eventoExiste) {
            throw new BadRequestException(
                'Ja existe um evento cadastrado neste local no mesmo horario!',
            );
        }

        try {
            console.log(data);
            console.log(usuarioId);
            const eventCreate = await this.prismaService.evento.create({
                data: {
                    titulo: data.titulo,
                    descricao: data.descricao,
                    dataHoraInicio: data.dataHoraInicio,
                    dataHoraTermino: data.dataHoraTermino,
                    localId: data.localId,
                    usuarioId: usuarioId,
                    urlImagem: imagePath,
                },
            });
            return eventCreate;
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Ocorreu um erro ao criar o evento');
        }
    }

    //Listagem de eventos
    async findMany() {
        try {
            return await this.prismaService.evento.findMany({
                include: {
                    usuario: {
                        select: {
                            nome: true,
                        },
                    },
                },
            });
        } catch (e) {
            console.log(e);
            throw new BadRequestException(
                'Ocorreu um erro ao listar os eventos',
            );
        }
    }

    //Listagem de evento único
    async findUnique(id: string) {
        try {
            return await this.prismaService.evento.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (e) {
            console.log(e);
            throw new BadRequestException('Ocorreu um erro ao listar o evento');
        }
    }

    //Alteração de eventos
    async updateEvent(id: string, updateEventDto: Partial<any>): Promise<any> {
        try {
            return await this.prismaService.evento.update({
                where: {
                    id,
                },
                data: updateEventDto,
            });
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao alterar os eventos',
            );
        }
    }

    //Remoção de evento único
    async deleteEvent(id: string) {
        try {
            await this.prismaService.evento.delete({
                where: {
                    id: id,
                },
            });
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao excluir o evento',
            );
        }
    }
}
