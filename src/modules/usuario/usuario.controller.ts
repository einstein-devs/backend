import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';

import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';

@ApiTags('UsuarioController')
@Controller('/usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('/alunos')
    @HttpCode(HttpStatus.OK)
    async findAllAlunos() {
        const alunos = await this.usuarioService.findAllAlunos();
        return new DefaultResponseDTO(alunos);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const usuarios = await this.usuarioService.findAll();
        return new DefaultResponseDTO(usuarios);
    }

    @Get('/:codigo')
    @ApiBody({
        required: true,
        schema: {
            default: {
                codigo: 'codigo',
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    async findByUser(@Param('codigo') codigo: string) {
        const usuario = await this.usuarioService.findOne(codigo);

        //delete usuario.senha;

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        return new DefaultResponseDTO(usuario);
    }

    @Post('/create')
    @ApiBody({
        required: true,
        schema: {
            default: {
                codigo: 'codigo',
                cursoId: 'cursoId',
                email: 'email',
                senha: 'senha',
                confirmarSenha: 'confirmarSenha',
            },
        },
    })
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUsuarioDto: UsuarioDto) {
        const usuarioCriado = await this.usuarioService.createUser(
            createUsuarioDto,
        );
        return new DefaultResponseDTO(usuarioCriado);
    }

    @Put('/:codigo/update')
    @ApiBody({
        required: true,
        schema: {
            default: {
                nome: 'nome',
                email: 'email',
                senha: 'senha',
                novaSenha: 'novaSenha',
                confirmacaoNovaSenha: 'confirmacaoNovaSenha',
            },
        },
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        @Param('codigo') codigoUsuario: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        await this.usuarioService.updateUser(codigoUsuario, updateUsuarioDto);
        return new DefaultResponseDTO({}, 'Usuário atualizado com sucesso!');
    }

    @Delete('/:codigo/delete')
    @ApiBody({
        required: true,
        schema: {
            default: {},
        },
    })
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteUser(@Param('codigo') codigo: string) {
        await this.usuarioService.deleteUser(codigo);
        return new DefaultResponseDTO({}, 'Usuário removido com sucesso!');
    }
}
