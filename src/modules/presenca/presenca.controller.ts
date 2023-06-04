import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParamsPostPresencaConfirmarDTO } from './dto/params-post-presenca-confirmar.dto';
import { ParamsPostPresencaDTO } from './dto/params-post-presenca.dto';
import { PresencaService } from './presenca.service';

@Controller('/presencas')
export class PresencaController {
    constructor(private readonly presencaService: PresencaService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':eventoId')
    async postPresenca(
        @Req() request,
        @Param() { eventoId }: ParamsPostPresencaDTO,
    ) {
        const usuarioId: string = request.user.id;
        const inscricaoCriada = await this.presencaService.createPresenca(
            eventoId,
            usuarioId,
        );

        return new DefaultResponseDTO(
            inscricaoCriada,
            'A inscrição foi confirmada com sucesso!',
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:eventoId/confirmar/:codigo')
    async postConfirmarPresenca(
        @Req() request,
        @Param() { eventoId, codigo }: ParamsPostPresencaConfirmarDTO,
    ) {
        const usuarioId: string = request.user.id;
        const presencaConfirmada = await this.presencaService.confirmarPresenca(
            eventoId,
            usuarioId,
            codigo,
        );

        return new DefaultResponseDTO(
            presencaConfirmada,
            'A presença foi confirmada com sucesso!',
        );
    }
}
