import {
  INestApplication,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CargoPosicao, Prisma, usuario } from '@prisma/client';
import { UsuarioDto } from './dto/usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.usuario.findMany({
        select: {
          id: true,
          email: true,
          nome: true,
          codigo: true,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar todos os usuários!',
      );
    }
  }

  async findOne(codigoDigitado: string) {
    try {
      return await this.prismaService.usuario.findFirstOrThrow({
        where: {
          codigo: codigoDigitado,
          dataExclusao: {
            not: null,
          },
        },
      });
    } catch {
      return null;
    }
  }

  async updateUser(
    codigoUsuario: string,
    { email, novaSenha, senha, confirmacaoNovaSenha, nome }: UpdateUsuarioDto,
  ) {
    try {
      const usuario = await this.findOne(codigoUsuario);

      if (!usuario || usuario.dataExclusao) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      const isValidSenha = await compare(senha, usuario.senha);
      if (!isValidSenha) {
        throw new UnauthorizedException('Senha inválida!');
      }

      const data: Partial<usuario> = {};

      if (email) {
        data.email = email;
      }

      if (novaSenha && confirmacaoNovaSenha) {
        if (novaSenha == confirmacaoNovaSenha) {
          const novaSenhaCriptografada = await hash(novaSenha, 8);
          data.senha = novaSenhaCriptografada;
        } else {
          throw new BadRequestException('As senhas não coincidem!');
        }
      }

      if (nome) {
        data.nome = nome;
      }

      usuario;

      return await this.prismaService.usuario.update({
        where: {
          codigo: codigoUsuario,
        },
        data: data,
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar usuário!',
      );
    }
  }

  async deleteUser(codigoDigitado: string) {
    try {
      await this.prismaService.usuario.update({
        where: {
          codigo: codigoDigitado,
        },
        data: {
          dataExclusao: new Date(),
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao deletar usuari',
      );
    }
  }

  async createUser(data: UsuarioDto): Promise<usuario> {
    try {
      return await this.prismaService.usuario.create({
        data: {
          codigo: data.codigo,
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cargo: CargoPosicao.ALUNO,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar um novo usuário!',
      );
    }
  }
}
