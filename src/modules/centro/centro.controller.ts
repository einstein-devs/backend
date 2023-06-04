import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CargoPosicao } from '@prisma/client';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CentroService } from './centro.service';
import { CreateCentroDto } from './dtos/create-centro.dto';
import { FindManyCentrosDto } from './dtos/find-many-centros.dto';

@UseGuards(JwtAuthGuard, CargoGuard)
@Controller('/centros')
export class CentroController {
    constructor(private readonly centroService: CentroService) {}

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Get()
    async findMany(@Req() req, @Query() filtros: FindManyCentrosDto) {
        const usuarioId: string = req.user.id;
        const cursos = await this.centroService.findMany(filtros, usuarioId);
        return new DefaultResponseDTO(
            cursos,
            'Centros encontrados com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Post()
    async postCentro(@Req() req, @Body() createCentroDto: CreateCentroDto) {
        const usuarioId: string = req.user.id;
        const centroCriado = await this.centroService.create(
            createCentroDto,
            usuarioId,
        );
        return new DefaultResponseDTO(
            centroCriado,
            'Centro criado com sucesso!',
        );
    }
}
