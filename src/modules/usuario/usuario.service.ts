import {
    INestApplication,
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
    ConsoleLogger,
} from '@nestjs/common';
import { CargoPosicao, Prisma, usuario } from '@prisma/client';
import { UsuarioDto } from './dto/usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { compare, compareSync, hash } from 'bcrypt';
import { error } from 'console';
import { errorMonitor } from 'events';

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
                    curso: true,
                    dataCriacao: true,
                    dataAtualizacao: true,
                    dataExclusao: true,
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
                },
            });
        } catch {
            return null;
        }
    }

    async updateUser(
        codigoUsuario: string,
        {
            email,
            novaSenha,
            senha,
            confirmacaoNovaSenha,
            nome,
        }: UpdateUsuarioDto,
    ) {
        const data: Partial<UpdateUsuarioDto> = {};

        try {
            const usuario = await this.prismaService.usuario.findFirst({
                select: { senha: true, dataExclusao: true },
                where: {
                    codigo: codigoUsuario,
                },
            });

            if (!usuario || usuario.dataExclusao) {
                throw new NotFoundException('Usuário não encontrado!');
            }

            const isValidSenha = await compare(senha, usuario.senha);

            if (!isValidSenha) {
                throw new UnauthorizedException('Senha inválida!');
            }

            if (email) {
                data.email = email;
            }

            data.nome = nome;

            if (novaSenha && confirmacaoNovaSenha) {
                if (novaSenha == confirmacaoNovaSenha) {
                    const novaSenhaCriptografada = await hash(novaSenha, 8);
                    data.senha = novaSenhaCriptografada;
                } else {
                    throw new BadRequestException('As senhas não coincidem!');
                }
            }

            return await this.prismaService.usuario.update({
                where: {
                    codigo: codigoUsuario,
                },
                data: data,
            });
        } catch (error) {
            throw error;
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
                    cargo: {
                        connect: {
                            posicao: CargoPosicao.ALUNO,
                        },
                    },
                    curso: {
                        connect: {
                            id: data.cursoid,
                        },
                    },
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao criar um novo usuário!',
            );
        }
    }
}
