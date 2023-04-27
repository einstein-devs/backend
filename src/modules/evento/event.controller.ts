import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ParamsGetEvento } from './dto/params-post-eventos';
import { eventDTO } from './dto/create-evento-dto';
import { stringify } from 'querystring';
import { ApiBody } from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { updateDTO } from './dto/update-evento-dto';

@Controller('/eventos')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Criação de eventos
  @Post('/create')
  async postEvent(@Body() createEventDto: eventDTO) {
    const eventCreate = await this.eventService.createEvent(createEventDto);
    return new DefaultResponseDTO(eventCreate, 'Evento criado com sucesso');
  }

  //Listagem de eventos
  @Get('/consulta')
  async findMany() {
    const events = await this.eventService.findMany();
    return new DefaultResponseDTO(events, 'Eventos retornados com sucesso');
  }

  //Alteração de eventos
  @Put(':id')
  async updateEvent(@Param('id') id: number, @Body() data: updateDTO) {
    return await this.eventService.updateEvent(Number(id), data);
  }
}
