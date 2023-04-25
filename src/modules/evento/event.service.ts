import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { eventDTO } from './dto/create-evento-dto';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  //Criação de eventos
  async createEvent(data: eventDTO) {
    try {
      const eventCreate = await this.prismaService.evento.create({
        data: {
          titulo: data.titulo,
          codigo: data.codigo,
          descricao: data.descricao,
          dataHoraInicio: data.dataHoraInicio,
          dataHoraTermino: data.dataHoraTermino,
        },
      });
      return eventCreate;
    } catch {
      throw new BadRequestException('Ocorreu um erro ao criar o evento');
    }
  }

  //Listagem de eventos
  async findMany() {
    try {
      return await this.prismaService.evento.findMany();
    } catch {
      throw new BadRequestException('Ocorreu um erro ao listar os eventos');
    }
  }
}
