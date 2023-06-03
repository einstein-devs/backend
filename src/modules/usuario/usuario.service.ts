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
import { FindManyAlunosDto } from './dto/find-many-alunos.dto';
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

            return filtros.cargos.includes(usuario.cargo.posicao);
        } catch (_) {
            console.log(_);
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

    async findAllAlunos(filtros: FindManyAlunosDto) {
        try {
            let whereOr: any = {
                cargo: {
                    isNot: {
                        posicao: {
                            in: ['COORDENADOR', 'DIRETOR'],
                        },
                    },
                },
            };

            if (filtros.search && filtros.search != '') {
                whereOr['OR'] = [
                    {
                        nome: {
                            contains: filtros.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: filtros.search,
                            mode: 'insensitive',
                        },
                    },
                ];
            }

            return await this.prismaService.usuario.findMany({
                include: {
                    curso: true,
                    cargo: true,
                },
                where: { ...whereOr },
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
        const curso = await this.prismaService.curso.findUnique({
            where: {
                id: data.cursoId,
            },
        });

        if (!curso) {
            throw new NotFoundException('Curso não encontrado!');
        }

        const usuarioExiste = await this.prismaService.usuario.findFirst({
            where: {
                cursoId: data.cursoId,
                OR: {
                    nome: {
                        equals: data.nome,
                        mode: 'insensitive',
                    },
                    email: {
                        equals: data.email,
                        mode: 'insensitive',
                    },
                },
            },
        });

        if (usuarioExiste) {
            throw new BadRequestException('O usuario ja existe!');
        }

        try {
            var codigoAleatorio = '';
            for (var i = 0; i < 5; i++) {
                codigoAleatorio += Math.floor(Math.random() * 10);
            }

            codigoAleatorio += curso.id.substring(4, 7);

            return await this.prismaService.usuario.create({
                data: {
                    codigo: codigoAleatorio,
                    nome: data.nome,
                    email: data.email,
                    senha: codigoAleatorio,
                    cargo: {
                        connect: {
                            posicao: CargoPosicao.ALUNO,
                        },
                    },
                    curso: {
                        connect: {
                            id: data.cursoId,
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
