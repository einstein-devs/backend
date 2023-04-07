import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
    const usuarioId: number = request.user.id;
    const presencaCriada = await this.presencaService.createPresenca(
      eventoId,
      usuarioId,
    );

    return new DefaultResponseDTO(
      presencaCriada,
      'A inscrição foi confirmada com sucesso!',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/confirmar/:eventoId')
  async postConfirmarPresenca(
    @Req() request,
    @Param() { eventoId }: ParamsPostPresencaDTO,
  ) {
    const usuarioId: number = request.user.id;
    const presencaCriada = await this.presencaService.confirmarPresenca(
      eventoId,
      usuarioId,
    );

    return new DefaultResponseDTO(
      presencaCriada,
      'A presença foi confirmada com sucesso!',
    );
  }
}
