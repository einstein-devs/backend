import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CargoPosicao } from '@prisma/client';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalDto } from './dto/local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { LocalService } from './local.service';

@UseGuards(JwtAuthGuard, CargoGuard)
@Controller('/locais')
export class LocalController {
    constructor(private readonly localService: LocalService) {}

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Get('/:id')
    async findUnique(@Param('id') id: string) {
        const localEncontrado = await this.localService.findUnique(id);
        return new DefaultResponseDTO(
            localEncontrado,
            'Local encontrado com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Put('/:id')
    async update(@Param('id') id: string, @Body() data: UpdateLocalDto) {
        const localAtualizado = await this.localService.update(id, data);
        return new DefaultResponseDTO(
            localAtualizado,
            'Local atualizado com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        await this.localService.delete(id);
        return new DefaultResponseDTO({}, 'Local deletado com sucesso!');
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Post()
    async create(@Body() localData: LocalDto) {
        console.log(localData);
        const localCriado = await this.localService.create(localData);
        return new DefaultResponseDTO(localCriado, 'Local criado com sucesso!');
    }

    @SomenteCargos(CargoPosicao.DIRETOR, CargoPosicao.COORDENADOR)
    @Get()
    async findMany() {
        const locais = await this.localService.findMany();
        return new DefaultResponseDTO(
            locais,
            'Locais encontrados com sucesso!',
        );
    }
}

export default LocalController;
