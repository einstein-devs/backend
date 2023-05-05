import { Module } from '@nestjs/common';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [EventoController],
    providers: [EventoService, PrismaService],
})
export class EventoModule {}
