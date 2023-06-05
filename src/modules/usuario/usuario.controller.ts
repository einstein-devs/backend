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
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';

import { CargoPosicao } from '@prisma/client';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { FindManyAlunosDto } from './dto/find-many-alunos.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';

@ApiTags('UsuarioController')
@Controller('/usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('/alunos')
    @HttpCode(HttpStatus.OK)
    async findAllAlunos(@Query() filtros: FindManyAlunosDto) {
        const alunos = await this.usuarioService.findAllAlunos(filtros);
        return new DefaultResponseDTO(alunos);
    }

    @UseGuards(JwtAuthGuard, CargoGuard)
    @SomenteCargos(CargoPosicao.DIRETOR)
    @Get('/coordenadores')
    @HttpCode(HttpStatus.OK)
    async findAllCoordenadores(@Query() filtros: FindManyAlunosDto) {
        const alunos = await this.usuarioService.findAllCoordenadores(filtros);
        return new DefaultResponseDTO(alunos);
    }

    @Post('/esqueci-senha')
    async esqueciSenha(@Body() esqueciSenhaDto: EsqueciSenhaDto) {
        await this.usuarioService.enviarEmailEsqueciSenha(esqueciSenhaDto);
        return new DefaultResponseDTO({});
    }

    @Post('/redefinir-senha')
    async redefinirSenha(@Body() redefinirSenhaDto: RedefinirSenhaDto) {
        await this.usuarioService.redefinirSenha(redefinirSenhaDto);
        return new DefaultResponseDTO({});
    }

    @Post('/redefinir-senha/validar/:id')
    async validarRedefinirSenhaCodigo(@Param('id') id: string) {
        await this.usuarioService.validarRedefinirSenhaCodigo(id);
        return new DefaultResponseDTO({});
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const usuarios = await this.usuarioService.findAll();
        return new DefaultResponseDTO(usuarios);
    }

    @Get('/:codigo')
    @HttpCode(HttpStatus.OK)
    async findByUser(@Param('codigo') codigo: string) {
        const usuario = await this.usuarioService.findOne(codigo);

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        return new DefaultResponseDTO(usuario);
    }

    @SomenteCargos(CargoPosicao.COORDENADOR, CargoPosicao.DIRETOR)
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUsuarioDto: UsuarioDto) {
        const usuarioCriado = await this.usuarioService.createUser(
            createUsuarioDto,
        );
        return new DefaultResponseDTO(usuarioCriado);
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Post('/create/coordenador')
    @HttpCode(HttpStatus.CREATED)
    async createUserCoordenador(@Body() createUsuarioDto: UsuarioDto) {
        const usuarioCriado = await this.usuarioService.createUserCoordenador(
            createUsuarioDto,
        );
        return new DefaultResponseDTO(usuarioCriado);
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Put('/alunos/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateAlunoDashboard(
        @Param('codigo') codigoUsuario: string,
        @Body() updateAlunoDto: UpdateAlunoDto,
    ) {
        const usuario = await this.usuarioService.updateAlunoDashboard(
            codigoUsuario,
            updateAlunoDto,
        );
        return new DefaultResponseDTO(
            usuario,
            'Usuário atualizado com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Put('/coordenadores/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCoordenadorDashboard(
        @Param('codigo') codigoUsuario: string,
        @Body() updateAlunoDto: UpdateAlunoDto,
    ) {
        const usuario = await this.usuarioService.updateCoordenadorDashboard(
            codigoUsuario,
            updateAlunoDto,
        );
        return new DefaultResponseDTO(
            usuario,
            'Usuário atualizado com sucesso!',
        );
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Delete('/coordenadores/:codigo')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCoordenador(@Param('codigo') codigoUsuario: string) {
        await this.usuarioService.deleteCoordenador(codigoUsuario);
        return new DefaultResponseDTO({}, 'Usuário deletado com sucesso!');
    }

    @SomenteCargos(CargoPosicao.DIRETOR)
    @Delete('/alunos/:codigo')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAluno(@Param('codigo') codigoUsuario: string) {
        await this.usuarioService.deleteAluno(codigoUsuario);
        return new DefaultResponseDTO({}, 'Usuário deletado com sucesso!');
    }

    @Put('/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        @Param('codigo') codigoUsuario: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        const usuario = await this.usuarioService.updateUser(
            codigoUsuario,
            updateUsuarioDto,
        );
        return new DefaultResponseDTO(
            usuario,
            'Usuário atualizado com sucesso!',
        );
    }

    @Delete('/:codigo/delete')
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteUser(@Param('codigo') codigo: string) {
        await this.usuarioService.deleteUser(codigo);
        return new DefaultResponseDTO({}, 'Usuário removido com sucesso!');
    }
}
