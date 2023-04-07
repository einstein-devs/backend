import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PresencaController } from './presenca.controller';
import { PresencaService } from './presenca.service';

@Module({
  controllers: [PresencaController],
  providers: [PresencaService, PrismaService],
})
export class PresencaModule {}
