/* eslint-enable prettier/prettier */
import { Module } from '@nestjs/common';
import { CentroController } from './centro.controller';
import { CentroService } from './centro.service';

@Module({
    controllers: [CentroController],
    providers: [CentroService],
})
export class CentroModule {}
