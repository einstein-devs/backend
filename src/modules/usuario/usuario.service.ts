import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CargoPosicao, usuario } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(private readonly prismaService: PrismaService) {}

    async hasCargoPermission(filtros: {
        idUsuario: string;
        cargos: string[];
    }): Promise<boolean> {
        try {
            const usuario = await this.prismaService.usuario.findUnique({
                select: {
                    cargo: true,
                },
                where: {
                    id: filtros.idUsuario,
                },
            });
            console.log(usuario.cargo);

            return filtros.cargos.includes(usuario.cargo.posicao);
        } catch {
            throw new UnauthorizedException(
                'Ocorreu um erro ao validar cargo!',
            );
        }
    }

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
                include: {
                    cargo: {
                        select: {
                            id: true,
                            posicao: true,
                        },
                    },
                },
                where: {
                    codigo: codigoDigitado,
                },
            });
        } catch {
            return null;
        }
    }

    async findOneById(id: string) {
        try {
            return await this.prismaService.usuario.findFirstOrThrow({
                include: {
                    curso: true,
                    cargo: {
                        select: {
                            id: true,
                            posicao: true,
                        },
                    },
                },
                where: {
                    id: id,
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
