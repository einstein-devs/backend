import {
    Controller,
    Post,
    Get,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { ParamsGetEventoDto } from './dto/params-post-eventos';
import { CreateEventDto } from './dto/create-evento-dto';
import { stringify } from 'querystring';
import { ApiBody } from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { UpdateEventoDTO } from './dto/update-evento-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/eventos')
export class EventoController {
    constructor(private readonly eventService: EventoService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async postEvent(@Body() createEventDto: CreateEventDto) {
        const eventCreate = await this.eventService.createEvent(createEventDto);
        return new DefaultResponseDTO(eventCreate, 'Evento criado com sucesso');
    }

    //Listagem de eventos
    @Get()
    @HttpCode(HttpStatus.OK)
    async findMany() {
        const events = await this.eventService.findMany();
        return new DefaultResponseDTO(events, 'Eventos retornados com sucesso');
    }

    //Listagem de evento unico
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findUnique(@Param('id') id: string) {
        const events = await this.eventService.findUnique(id);
        return new DefaultResponseDTO(events, 'Evento retornado com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateEvent(@Param('id') id: string, @Body() data: UpdateEventoDTO) {
        const event = await this.eventService.updateEvent(id, data);
        return new DefaultResponseDTO(event, 'Evento atualizado com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteEvent(@Param('id') id: string) {
        await this.eventService.deleteEvent(id);
        return new DefaultResponseDTO({}, 'Evento excluído com sucesso');
    }
}
