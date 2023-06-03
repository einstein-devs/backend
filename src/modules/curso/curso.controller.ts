import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CargoPosicao } from '@prisma/client';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CursoService } from './curso.service';
import { FindManyCursosDto } from './dtos/find-many-cursos.dto';

@UseGuards(JwtAuthGuard, CargoGuard)
@Controller('/cursos')
export class CursoController {
    constructor(private readonly cursoService: CursoService) {}

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Get()
    async findMany(@Query() filtros: FindManyCursosDto) {
        const cursos = await this.cursoService.findMany(filtros);
        return new DefaultResponseDTO(
            cursos,
            'Cursos encontrados com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Post()
    async postCurso(@Query() filtros: FindManyCursosDto) {
        const cursos = await this.cursoService.findMany(filtros);
        return new DefaultResponseDTO(
            cursos,
            'Cursos encontrados com sucesso!',
        );
    }
}
