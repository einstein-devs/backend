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
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dtos/create-curso.dto';
import { FindManyCursosDto } from './dtos/find-many-cursos.dto';

@UseGuards(JwtAuthGuard, CargoGuard)
@Controller('/cursos')
export class CursoController {
    constructor(private readonly cursoService: CursoService) {}

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Get()
    async findMany(@Req() req, @Query() filtros: FindManyCursosDto) {
        const usuarioId: string = req.user.id;
        const cursos = await this.cursoService.findMany(filtros, usuarioId);
        return new DefaultResponseDTO(
            cursos,
            'Cursos encontrados com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Post()
    async postCurso(@Req() req, @Body() createCursoDto: CreateCursoDto) {
        const usuarioId: string = req.user.id;
        const cursoCriado = await this.cursoService.create(
            createCursoDto,
            usuarioId,
        );
        return new DefaultResponseDTO(cursoCriado, 'Curso criado com sucesso!');
    }
}
