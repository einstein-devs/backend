import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [],
  providers: [UsuarioService, PrismaService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
