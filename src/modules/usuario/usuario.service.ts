import { MailerService } from '@nestjs-modules/mailer';
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
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { FindManyAlunosDto } from './dto/find-many-alunos.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
    ) {}

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
                where: {
                    dataExclusao: null,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar todos os usuários!',
            );
        }
    }

    async findAllCoordenadores(filtros: FindManyAlunosDto) {
        try {
            let whereOr: any = {
                cargo: {
                    isNot: {
                        posicao: {
                            in: ['DIRETOR', 'ALUNO'],
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
                    cursoCoordenado: true,
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

    async findAluno(codigo: string) {
        try {
            return await this.prismaService.usuario.findFirst({
                include: {
                    curso: true,
                    cursoCoordenado: true,
                    cargo: true,
                },
                where: {
                    codigo,
                    dataExclusao: null,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar o aluno!',
            );
        }
    }

    async findCoordenador(codigo: string) {
        try {
            return await this.prismaService.usuario.findUnique({
                include: {
                    curso: true,
                    cursoCoordenado: true,
                    cargo: true,
                },
                where: {
                    codigo,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao buscar o aluno!',
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
                where: {
                    ...whereOr,
                    dataExclusao: null,
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
                    cursoCoordenado: true,
                    curso: true,
                    cargo: true,
                },
                where: {
                    codigo: codigoDigitado,
                    dataExclusao: null,
                },
            });
        } catch {
            return null;
        }
    }

    async findOneById(id: string) {
        try {
            const usuario = await this.prismaService.usuario.findFirstOrThrow({
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
                    dataExclusao: null,
                },
            });

            return usuario;
        } catch {
            return null;
        }
    }

    async updateAlunoDashboard(
        codigoUsuario: string,
        { email, cursoId, nome }: UpdateAlunoDto,
    ) {
        const data: Partial<UpdateAlunoDto> = {};

        const usuarioExisteEmail = await this.prismaService.usuario.findFirst({
            where: {
                codigo: {
                    not: {
                        equals: codigoUsuario,
                    },
                },
                email,
                dataExclusao: null,
            },
        });

        if (usuarioExisteEmail) {
            throw new BadRequestException('Usuário com e-mail já existe!');
        }

        try {
            const usuario = await this.prismaService.usuario.findFirst({
                select: { senha: true, dataExclusao: true },
                where: {
                    codigo: codigoUsuario,
                    dataExclusao: null,
                },
            });

            if (!usuario || usuario.dataExclusao) {
                throw new NotFoundException('Usuário não encontrado!');
            }

            if (email) {
                data.email = email;
            }

            if (cursoId) {
                const curso = await this.prismaService.curso.findFirst({
                    where: {
                        id: cursoId,
                    },
                    select: {
                        id: true,
                    },
                });

                if (!curso) {
                    throw new NotFoundException('Não existe esse curso!');
                }

                data.cursoId = curso.id;
            }

            if (nome) {
                data.nome = nome;
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

    async deleteAluno(codigo: string) {
        try {
            const usuario = await this.prismaService.usuario.findFirst({
                where: {
                    codigo,
                    dataExclusao: null,
                },
            });

            if (!usuario) {
                throw new NotFoundException('Usuário não encontrado!');
            }

            await this.prismaService.usuario.update({
                where: {
                    codigo,
                },
                data: {
                    dataExclusao: new Date(),
                },
            });
        } catch {
            throw new BadRequestException('Não possível excluir aluno!');
        }
    }

    async deleteCoordenador(codigo: string) {
        try {
            const usuario = await this.prismaService.usuario.findFirst({
                where: {
                    codigo,
                    dataExclusao: null,
                },
            });

            if (!usuario) {
                throw new NotFoundException('Usuário não encontrado!');
            }

            await this.prismaService.usuario.update({
                where: {
                    codigo,
                },
                data: {
                    dataExclusao: new Date(),
                },
            });
        } catch {
            throw new BadRequestException('Não possível excluir coordenador!');
        }
    }

    async updateCoordenadorDashboard(
        codigoUsuario: string,
        { email, cursoId, nome }: UpdateAlunoDto,
    ) {
        const data: any = {};

        const usuarioExisteEmail = await this.prismaService.usuario.findFirst({
            where: {
                codigo: {
                    not: {
                        equals: codigoUsuario,
                    },
                },
                email,
            },
        });

        if (usuarioExisteEmail) {
            throw new BadRequestException('Usuário com e-mail já existe!');
        }

        try {
            const usuario = await this.prismaService.usuario.findFirst({
                select: { senha: true, dataExclusao: true },
                where: {
                    codigo: codigoUsuario,
                    dataExclusao: null,
                },
            });

            if (!usuario || usuario.dataExclusao) {
                throw new NotFoundException('Usuário não encontrado!');
            }

            if (email) {
                data.email = email;
            }

            if (cursoId) {
                const curso = await this.prismaService.curso.findFirst({
                    where: {
                        id: cursoId,
                    },
                    select: {
                        id: true,
                    },
                });

                if (!curso) {
                    throw new NotFoundException('Não existe esse curso!');
                }

                data['cursoCoordenado'] = {
                    disconnect: true,
                    connect: {
                        id: curso.id,
                    },
                };
            }

            if (nome) {
                data.nome = nome;
            }

            return await this.prismaService.usuario.update({
                where: {
                    codigo: codigoUsuario,
                },
                data: { ...data },
            });
        } catch (error) {
            throw error;
        }
    }

    async updateUser(
        codigoUsuario: string,
        { email, novaSenha, senha, confirmacaoNovaSenha }: UpdateUsuarioDto,
    ) {
        const data: Partial<UpdateUsuarioDto> = {};

        try {
            const usuario = await this.prismaService.usuario.findFirst({
                select: { senha: true, dataExclusao: true },
                where: {
                    codigo: codigoUsuario,
                    dataExclusao: null,
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
                email: {
                    equals: data.email,
                    mode: 'insensitive',
                },
                dataExclusao: null,
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

            const senhaEncriptada = await hash(codigoAleatorio, 8);

            return await this.prismaService.usuario.create({
                data: {
                    codigo: codigoAleatorio,
                    nome: data.nome,
                    email: data.email,
                    senha: senhaEncriptada,
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

    async createUserCoordenador(data: UsuarioDto): Promise<usuario> {
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
                email: {
                    equals: data.email,
                    mode: 'insensitive',
                },
                dataExclusao: null,
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

            const senhaEncriptada = await hash(codigoAleatorio, 8);

            return await this.prismaService.usuario.create({
                data: {
                    codigo: codigoAleatorio,
                    nome: data.nome,
                    email: data.email,
                    senha: senhaEncriptada,
                    cargo: {
                        connect: {
                            posicao: CargoPosicao.COORDENADOR,
                        },
                    },
                    cursoCoordenado: {
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

    async validarRedefinirSenhaCodigo(id: string) {
        try {
            const redefinicao =
                await this.prismaService.redefinicaoSenha.findFirst({
                    where: {
                        id: id,
                        utilizado: false,
                    },
                    orderBy: {
                        dataEmissao: 'desc',
                    },
                });

            if (redefinicao.dataLimite.valueOf() < new Date().valueOf()) {
                throw new BadRequestException(
                    'Data limite para redefinição excedida!',
                );
            }
        } catch (_) {
            console.log(_);
            throw new BadRequestException(
                'Ocorreu um erro ao validar codigo de redefinição de senha!',
            );
        }
    }

    async redefinirSenha(redefinirSenhaDto: RedefinirSenhaDto) {
        if (
            redefinirSenhaDto.novaSenha !=
            redefinirSenhaDto.confirmacaoNovaSenha
        ) {
            throw new BadRequestException('As senhas são diferentes!');
        }

        const redefinicao = await this.prismaService.redefinicaoSenha.findFirst(
            {
                where: {
                    id: redefinirSenhaDto.redefinicaoId,
                    utilizado: false,
                },
                orderBy: {
                    dataEmissao: 'desc',
                },
            },
        );

        if (!redefinicao) {
            throw new NotFoundException(
                'Código de redefinição inválido ou expirado!',
            );
        }

        if (redefinicao.dataLimite.valueOf() < new Date().valueOf()) {
            throw new BadRequestException(
                'Data limite para redefinição excedida!',
            );
        }

        const usuario = await this.prismaService.usuario.findFirst({
            where: {
                id: redefinicao.usuarioId,
                dataExclusao: null,
            },
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        try {
            const senhaCriptada = await hash(redefinirSenhaDto.novaSenha, 8);

            await this.prismaService.$transaction([
                this.prismaService.usuario.update({
                    where: {
                        id: redefinicao.usuarioId,
                    },
                    data: {
                        senha: senhaCriptada,
                    },
                }),
                this.prismaService.redefinicaoSenha.update({
                    where: {
                        id: redefinicao.id,
                    },
                    data: {
                        utilizado: true,
                    },
                }),
            ]);
        } catch (_) {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao tentar recuperar a senha!',
            );
        }
    }

    async enviarEmailEsqueciSenha({
        email,
        enviarParaDashboard,
    }: EsqueciSenhaDto) {
        const usuario = await this.prismaService.usuario.findFirst({
            where: {
                email,
                dataExclusao: null,
            },
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        const redefinicoes =
            await this.prismaService.redefinicaoSenha.findFirst({
                where: {
                    usuario: {
                        email,
                    },
                    utilizado: false,
                },
                orderBy: {
                    dataEmissao: 'desc',
                },
            });

        if (redefinicoes) {
            if (redefinicoes.dataEmissao.valueOf() > new Date().valueOf()) {
                throw new BadRequestException('Já existe um pedido pendente!');
            }
        }

        try {
            const dataAtual = new Date();
            dataAtual.setMinutes(dataAtual.getMinutes() + 2);

            const redefinicao =
                await this.prismaService.redefinicaoSenha.create({
                    data: {
                        usuarioId: usuario.id,
                        utilizado: false,
                        dataLimite: dataAtual,
                    },
                });

            let hostWebServer = 'http://localhost:9090';

            if (enviarParaDashboard) {
                hostWebServer = 'http://localhost:3000';
            }

            await this.mailerService.sendMail({
                to: email,
                from: 'eventon@gmail.com',
                subject: 'Recuperação de senha',
                messageId: redefinicao.id,
                html: `
                <!DOCTYPE html>
                <html>
                <head><style>
                        body {
                            font-family: system-ui;
                            background: white;
                            color: black;
                            text-align: center;
                        }
                        
                        .main {
                            padding: 20px;
                        }
                        
                        a {
                            color: orange;
                        }
                    </style></head>

                    <body>
                        <div class="main">
                            <h1>Redefinir Senha</h1>
                            
                            <p>Uma alteração de senha foi solicitada, clique no link abaixo para redefinir sua senha!</p>
                            <a href="${hostWebServer}/recuperar-senha/${redefinicao.id}" target="blank">Recuperar senha</a>
                        </div>
                    </body></html>
                `,
            });
        } catch {
            throw new InternalServerErrorException(
                'Ocorreu um erro ao tentar recuperar a senha!',
            );
        }
    }
}
