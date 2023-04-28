import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { eventDTO } from './dto/create-evento-dto';
import { updateEventoDTO } from './dto/update-evento-dto';

@Injectable()
export class EventoService {
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

  //Listagem de evento único
  async findUnique(id: number) {
    try {
      return await this.prismaService.evento.findUnique({
        where: {
          id: id,
        },
      });
    } catch {
      throw new BadRequestException('Ocorreu um erro ao listar o evento');
    }
  }

  //Alteração de eventos
  async updateEvent(id: number, updateEventDto: Partial<any>): Promise<any> {
    try {
      return await this.prismaService.evento.update({
        where: {
          id,
        },
        data: updateEventDto,
      });
    } catch {
      throw new BadRequestException('Ocorreu um erro ao alterar os eventos');
    }
  }

  //Remoção de eventos
  async deleteManyEvent() {
    try {
      return await this.prismaService.evento.deleteMany();
    } catch {
      throw new BadRequestException('Ocorreu um erro ao excluir os eventos');
    }
  }

  //Remoção de evento único
  async deleteEvent(id: number) {
    try {
      return await this.prismaService.evento.delete({
        where: {
          id: id,
        },
      });
    } catch {
      throw new BadRequestException('Ocorreu um erro ao excluir o evento');
    }
  }
}
