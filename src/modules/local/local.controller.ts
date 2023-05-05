import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { LocalService } from './local.service';
import { LocalDto } from './dto/local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';

@Controller('/locais')
export class LocalController {
    constructor(private readonly localService: LocalService) {}

    @Get('/:id')
    async findUnique(@Param('id') id: string) {
        const localEncontrado = await this.localService.findUnique(id);
        return new DefaultResponseDTO(
            localEncontrado,
            'Local encontrado com sucesso!',
        );
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() data: UpdateLocalDto) {
        const localAtualizado = await this.localService.update(id, data);
        return new DefaultResponseDTO(
            localAtualizado,
            'Local atualizado com sucesso!',
        );
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        await this.localService.delete(id);
        return new DefaultResponseDTO({}, 'Local deletado com sucesso!');
    }

    @Post()
    async create(@Body() localData: LocalDto) {
        const localCriado = await this.localService.create(localData);
        return new DefaultResponseDTO(localCriado, 'Local criado com sucesso!');
    }
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
