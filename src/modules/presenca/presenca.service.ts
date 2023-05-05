import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PresencaService {
    constructor(private readonly prismaService: PrismaService) {}

    async confirmarPresenca(
        eventoId: string,
        usuarioId: string,
        codigo: string,
    ) {
        const eventoExiste = await this._findEventoById(eventoId);
        if (!eventoExiste) {
            throw new NotFoundException('Evento não encontrado!');
        }
        if (new Date() > eventoExiste.dataHoraTermino) {
            throw new UnauthorizedException('Evento indisponível!');
        }
        if (eventoExiste.codigo != codigo) {
            throw new UnauthorizedException(
                'Código de confirmação de presença inválido!',
            );
        }

        const presencaExiste = await this._findPresencaByEventoIdAndusuarioId(
            eventoId,
            usuarioId,
        );
        if (!presencaExiste) {
            throw new NotFoundException('Presença em evento não encontrada!');
        }
        if (presencaExiste.dataInscricao) {
            throw new UnauthorizedException(
                'Presença em evento já foi confirmada!',
            );
        }

        try {
            const presencaCriada = await this.prismaService.presenca.update({
                where: {
                    id: presencaExiste.id,
                },
                select: {
                    id: true,
                    usuarioId: true,
                    dataInscricao: true,
                    dataPresenca: true,
                    evento: true,
                },
                data: {
                    dataPresenca: new Date(),
                },
            });

            return presencaCriada;
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao confirmar presença!',
            );
        }
    }

    async createPresenca(eventoId: string, usuarioId: string) {
        const eventoExiste = await this._findEventoById(eventoId);
        if (!eventoExiste) {
            throw new NotFoundException('Evento não encontrado!');
        }
        if (new Date() > eventoExiste.dataHoraTermino) {
            throw new UnauthorizedException('Evento indisponível!');
        }

        const presencaExiste = await this._findPresencaByEventoIdAndusuarioId(
            eventoId,
            usuarioId,
        );
        if (presencaExiste) {
            throw new UnauthorizedException(
                'A inscrição já está confirmada para o evento!',
            );
        }

        try {
            const presencaCriada = await this.prismaService.presenca.create({
                select: {
                    id: true,
                    usuarioId: true,
                    dataInscricao: true,
                    dataPresenca: true,
                    evento: true,
                },
                data: {
                    eventoId: eventoId,
                    usuarioId: usuarioId,
                },
            });

            return presencaCriada;
        } catch {
            throw new BadRequestException(
                'Ocorreu um erro ao confirmar inscrição!',
            );
        }
    }

    private async _findEventoById(eventoId: string) {
        try {
            return await this.prismaService.evento.findUnique({
                where: {
                    id: eventoId,
                },
            });
        } catch {
            return null;
        }
    }

    private async _findPresencaByEventoIdAndusuarioId(
        eventoId: string,
        usuarioId: string,
    ) {
        try {
            return await this.prismaService.presenca.findFirst({
                where: {
                    AND: {
                        usuarioId,
                        eventoId,
                    },
                },
            });
        } catch {
            return null;
        }
    }
}
