import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dtos/create-certificado.dto';

@Injectable()
export class CertificadoService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCertificados(usuarioId: string) {
        try {
            const certificados = await this.prismaService.certificado.findMany({
                where: {
                    usuarioId: usuarioId,
                },
            });

            return certificados;
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao buscar certificados!',
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

        const presencaEncontrada = await this.prismaService.presenca.findUnique(
            {
                where: {
                    usuarioId: usuarioId,
                    eventoId: createCertificadoDto.eventoId,
                },
            },
        );

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
