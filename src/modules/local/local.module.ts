/* eslint-enable prettier/prettier */
import { Module } from '@nestjs/common';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [LocalController],
    providers: [LocalService],
})
export class LocalModule {}
