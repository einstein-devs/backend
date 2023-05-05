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
    async findUnique(@Param('id') id: number) {
        return await this.localService.findUnique(Number(id));
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() data: UpdateLocalDto) {
        return await this.localService.update(Number(id), data);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<void> {
        return await this.localService.delete(Number(id));
    }

    @Post()
    async create(@Body() localData: LocalDto) {
        return await this.localService.create(localData);
    }
    @Get()
    async findMany() {
        return await this.localService.findMany();
    }
}

export default LocalController;
