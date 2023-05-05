import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { PrismaClient } from '@prisma/client';

@Module({
    imports: [],
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService],
})
export class UsuarioModule {}
