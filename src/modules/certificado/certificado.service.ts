import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CargoPosicao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dtos/create-certificado.dto';

@Injectable()
export class CertificadoService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCertificados(usuarioId: string) {
        const usuario = await this.prismaService.usuario.findFirst({
            include: {
                cargo: true,
            },
            where: {
                id: usuarioId,
                dataExclusao: null,
            },
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        try {
            if (usuario.cargo.posicao == CargoPosicao.COORDENADOR) {
                return await this.prismaService.certificado.findMany({
                    where: {
                        usuario: {
                            curso: {
                                id: usuario.cursoCoordenadoId,
                            },
                        },
                    },
                });
            } else {
                return await this.prismaService.certificado.findMany();
            }
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar todos os certificados!',
            );
        }
    }

    async getMeusCertificados(usuarioId: string) {
        try {
            const certificados = await this.prismaService.certificado.findMany({
                include: {
                    evento: {
                        select: {
                            titulo: true,
                            usuario: {
                                select: {
                                    nome: true,
                                },
                            },
                            dataHoraInicio: true,
                            dataHoraTermino: true,
                        },
                    },
                },
                where: {
                    usuarioId: usuarioId,
                },
            });

            return certificados.map(certificado => {
                return {
                    id: certificado.id,
                    evento: { ...certificado.evento },
                    dataEmissao: certificado.dataEmissao,
                    usuario: {
                        nome: certificado.evento.usuario.nome,
                    },
                };
            });
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar certificados!',
            );
        }
    }

    async getCertificado(usuarioId: string, certificadoId: string) {
        try {
            const certificado = await this.prismaService.certificado.findFirst({
                include: {
                    evento: {
                        select: {
                            titulo: true,
                            usuario: {
                                select: {
                                    nome: true,
                                },
                            },
                            dataHoraInicio: true,
                            dataHoraTermino: true,
                        },
                    },
                },
                where: {
                    usuarioId: usuarioId,
                    id: certificadoId,
                },
            });

            return {
                id: certificado.id,
                evento: {
                    ...certificado.evento,
                },
                dataEmissao: certificado.dataEmissao,
                usuario: {
                    nome: certificado.evento.usuario.nome,
                },
            };
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar certificado!',
            );
        }
    }

    async gerarCertificado(
        usuarioId: string,
        createCertificadoDto: CreateCertificadoDto,
    ) {
        const certificadoEncontrado =
            await this.prismaService.certificado.findFirst({
                where: {
                    eventoId: createCertificadoDto.eventoId,
                    usuarioId: usuarioId,
                },
            });

        if (certificadoEncontrado) {
            throw new BadRequestException(
                'O certificado já foi emitido para este evento!',
            );
        }

        const eventoEncontrado = await this.prismaService.evento.findUnique({
            where: {
                id: createCertificadoDto.eventoId,
            },
        });

        if (!eventoEncontrado) {
            throw new NotFoundException('O evento não foi encontrado!');
        }

        if (eventoEncontrado.codigo != createCertificadoDto.codigoEvento) {
            throw new BadRequestException('Código de evento inválido!');
        }

        const presencaEncontrada = await this.prismaService.presenca.findFirst({
            where: {
                usuarioId: usuarioId,
                eventoId: createCertificadoDto.eventoId,
            },
        });

        if (!presencaEncontrada) {
            throw new NotFoundException(
                'Sua presença no evento não foi encontrada!',
            );
        }

        try {
            const certificadoGerado =
                await this.prismaService.certificado.create({
                    data: {
                        usuarioId: usuarioId,
                        eventoId: createCertificadoDto.eventoId,
                    },
                });

            return certificadoGerado;
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar certificados!',
            );
        }
    }
}
