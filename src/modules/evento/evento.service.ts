import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-evento-dto';
import { FindManyEventosDto } from './dto/find-many-eventos.dto';
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
            throw new BadRequestException('Ocorreu um erro ao criar o evento');
        }
    }

    async findManyDashboard(filtros: FindManyEventosDto, usuarioId: string) {
        try {
            const usuario = await this.prismaService.usuario.findUnique({
                include: {
                    cargo: true,
                },
                where: {
                    id: usuarioId,
                },
            });

            if (usuario.cargo.posicao == 'DIRETOR') {
                return await this.prismaService.evento.findMany({
                    include: {
                        usuario: {
                            select: {
                                nome: true,
                            },
                        },
                    },
                    where: filtros.search
                        ? {
                              titulo: {
                                  contains: filtros.search,
                                  mode: 'insensitive',
                              },
                          }
                        : {},
                    orderBy: {
                        dataCriacao: 'desc',
                    },
                });
            } else {
                return await this.prismaService.evento.findMany({
                    include: {
                        usuario: {
                            select: {
                                nome: true,
                            },
                        },
                    },
                    where: filtros.search
                        ? {
                              titulo: {
                                  contains: filtros.search,
                                  mode: 'insensitive',
                              },
                              usuarioId,
                          }
                        : {
                              usuarioId,
                          },
                    orderBy: {
                        dataCriacao: 'desc',
                    },
                });
            }
        } catch (e) {
            throw new BadRequestException(
                'Ocorreu um erro ao listar os eventos',
            );
        }
    }

    async findMany(filtros: FindManyEventosDto) {
        try {
            return await this.prismaService.evento.findMany({
                include: {
                    usuario: {
                        select: {
                            nome: true,
                        },
                    },
                },
                where: {
                    titulo: {
                        contains: filtros.search,
                        mode: 'insensitive',
                    },
                    AND: [
                        {
                            dataHoraTermino: {
                                gte: new Date(),
                            },
                        },
                        {
                            dataHoraInicio: {
                                gte: new Date(),
                            },
                        },
                    ],
                },
                orderBy: {
                    dataHoraInicio: 'asc',
                },
            });
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao listar os eventos',
            );
        }
    }

    //Listagem de evento único
    async findUnique(id: string, usuarioId?: string) {
        try {
            const evento = await this.prismaService.evento.findFirstOrThrow({
                include: {
                    local: true,
                    presenca: {
                        select: {
                            id: true,
                        },
                    },
                },
                where: {
                    id: id,
                },
            });

            let estaInscrito: boolean = false;
            let estaConfimado: boolean = false;
            let certificadoGerado: boolean = false;

            if (usuarioId) {
                const presencaExiste =
                    await this.prismaService.presenca.findFirst({
                        where: {
                            usuarioId,
                            eventoId: id,
                        },
                    });

                const certificadoExiste =
                    await this.prismaService.certificado.findFirst({
                        where: {
                            eventoId: id,
                            usuarioId,
                        },
                    });

                estaInscrito = !!presencaExiste;
                estaConfimado = !!presencaExiste
                    ? !!presencaExiste.dataPresenca
                    : false;
                certificadoGerado = !!certificadoExiste;
            }

            return {
                ...evento,
                inscritos: evento.presenca.length,
                estaInscrito,
                estaConfimado,
                certificadoGerado,
            };
        } catch {
            throw new BadRequestException('Ocorreu um erro ao listar o evento');
        }
    }

    //Alteração de eventos
    async updateEvent(
        id: string,
        updateEventDto: UpdateEventoDTO,
        imagePath?: string,
    ) {
        const evento = await this.prismaService.evento.findFirst({
            where: {
                id,
            },
        });
        if (!evento) {
            throw new NotFoundException('Evento não encontrado!');
        }

        if (evento.dataHoraInicio.valueOf() <= new Date().valueOf()) {
            throw new BadRequestException('Evento em curso ou finalizado!');
        }

        try {
            let dataToUpdate: any = {};

            if (updateEventDto.titulo) {
                dataToUpdate['titulo'] = updateEventDto.titulo;
            }
            if (updateEventDto.descricao) {
                dataToUpdate['descricao'] = updateEventDto.descricao;
            }
            if (updateEventDto.dataHoraInicio) {
                dataToUpdate['dataHoraInicio'] = updateEventDto.dataHoraInicio;
            }
            if (updateEventDto.dataHoraTermino) {
                dataToUpdate['dataHoraTermino'] =
                    updateEventDto.dataHoraTermino;
            }
            if (imagePath) {
                dataToUpdate['urlImagem'] = imagePath;
            }

            const response = await this.prismaService.$transaction(
                async prisma => {
                    if (imagePath && evento.urlImagem) {
                        unlinkSync(
                            join(
                                __dirname,
                                '..',
                                '..',
                                '..',
                                'public',
                                'images',
                                evento.urlImagem,
                            ),
                        );
                    }

                    return await prisma.evento.update({
                        where: {
                            id,
                        },
                        data: dataToUpdate,
                    });
                },
            );

            return response;
        } catch (_) {
            console.log(_);
            throw new BadRequestException(
                'Ocorreu um erro ao alterar os eventos',
            );
        }
    }

    async gerarCodigoEvento(id: string) {
        const eventoExiste = await this.prismaService.evento.findUnique({
            where: {
                id,
            },
        });

        if (!eventoExiste) {
            throw new NotFoundException('Não foi possível encontrar o evento!');
        }

        if (
            new Date(eventoExiste.dataHoraTermino).valueOf() <
            new Date().valueOf()
        ) {
            throw new BadRequestException(
                'Não é possível gerar um código para o evento que já passou!',
            );
        }

        if (eventoExiste.codigo) {
            throw new BadRequestException(
                'Já existe um código de evento gerado!',
            );
        }

        try {
            var codigoAleatorio = '';
            for (var i = 0; i < 5; i++) {
                codigoAleatorio += Math.floor(Math.random() * 10);
            }

            codigoAleatorio += id.substring(4, 7);

            return await this.prismaService.evento.update({
                include: {
                    local: true,
                    presenca: {
                        select: {
                            id: true,
                        },
                    },
                },
                where: {
                    id,
                },
                data: {
                    codigo: codigoAleatorio,
                },
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

    async findEventosInscritos(usuarioId: string) {
        try {
            const eventos = await this.prismaService.evento.findMany({
                include: {
                    local: true,
                    presenca: {
                        select: {
                            id: true,
                        },
                    },
                    usuario: true,
                },
                where: {
                    presenca: {
                        some: {
                            usuarioId: usuarioId,
                        },
                    },
                },
            });

            return eventos.map(item => {
                const inscritos = item.presenca.length;

                delete item.presenca;
                delete item.usuario.senha;

                return { ...item, inscritos };
            });
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar por eventos inscritos!',
            );
        }
    }
}
