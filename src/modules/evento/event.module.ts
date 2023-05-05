import { Module } from '@nestjs/common';
import { EventoController } from './event.controller';
import { EventoService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EventoController],
  providers: [EventoService, PrismaService],
})
export class EventoModule {}
