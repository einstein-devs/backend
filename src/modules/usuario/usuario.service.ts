import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(codigo: string) {
    return this.prismaService.usuario.findFirstOrThrow({
      where: {
        codigo: codigo,
      },
    });
  }
}
