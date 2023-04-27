
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { LocalDto } from "./dto/local.dto";
import { PrismaService } from "../prisma/prisma.service";
import { LocalModule } from "./local.module";

@Injectable()
export class LocalService {

  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<any[]> {
    try {
      return this.prisma.local.findMany();
    } catch {
      throw new InternalServerErrorException(
        "Ocorreu um erro ao buscar os locais!",
      );
    }
  }

  async findUnique(id:number): Promise<any> {
    try {
      return this.prisma.local.findUnique({
        where: {
          id:id,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o local!',
      );
    }
  }

  async create(localData:LocalDto): Promise<any> {
    try {
      return this.prisma.local.create({
        data: {
          titulo: localData.titulo,
          descricao: localData.descricao,
          urlImagem: localData.urlImagem,
        },
      });
      
    } catch {
      throw new InternalServerErrorException(
        "Ocorreu um erro ao criar um novo local!",
      );
    }
  }

  async update(id: number, data: Partial<any>): Promise<any> {
    try {
      return this.prisma.local.update({
        where: {
          id,
        },
        data:data,
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o local!',
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.local.delete({
        where: {
          id,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao excluir o local!',
      );
    }
  }
}

export default LocalService
