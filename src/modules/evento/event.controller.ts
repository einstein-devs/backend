import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { ParamsGetEvento } from './dto/params-post-eventos';
import { eventDTO } from './dto/create-evento-dto';
import { stringify } from 'querystring';
import { ApiBody } from '@nestjs/swagger';

@Controller('/eventos')
export class EventController {
    constructor (private readonly eventService: EventService){}

    // Criação de eventos
    @Post('/create')
    async postEvent(@Body() createEventDto: eventDTO) {
        return this.eventService.createEvent(createEventDto);
    }
    
    //Listagem de eventos
    @Get('/consulta')
    async findMany() {
        return await this.eventService.findMany();
    }
}
