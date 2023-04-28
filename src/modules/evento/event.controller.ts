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
import { EventoService } from './event.service';
import { ParamsGetEventoDto } from './dto/params-post-eventos';
import { eventDTO } from './dto/create-evento-dto';
import { stringify } from 'querystring';
import { ApiBody } from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { updateEventoDTO } from './dto/update-evento-dto';

@Controller('/eventos')
export class EventoController {
  constructor(private readonly eventService: EventoService) {}

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

  //Listagem de evento unico
  @Get('/consulta/:id')
  async findUnique(@Param('id') id: Number) {
    const events = await this.eventService.findUnique(Number(id));
    return new DefaultResponseDTO(events, 'Evento retornado com sucesso');
  }

  //Alteração de eventos
  @Put('/update/:id')
  async updateEvent(@Param('id') id: number, @Body() data: updateEventoDTO) {
    return await this.eventService.updateEvent(Number(id), data);
  }

  //Remoção de eventos
  @Delete('/delete')
  async deleteManyEvent() {
    const events = await this.eventService.deleteManyEvent();
    return new DefaultResponseDTO(events, 'Eventos excluídos com sucesso');
  }

  //Remoção de evento único
  @Delete('/delete/:id')
  async deleteEvent(@Param('id') id: number) {
    const events = await this.eventService.deleteEvent(Number(id));
    return new DefaultResponseDTO(events, 'Evento excluído com sucesso');
  }
}
