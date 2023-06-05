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
import { FindManyAlunosDto } from './dto/find-many-alunos.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenador.dto';

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

    @Put('/alunos/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateAlunoDashboard(
        @Param('codigo') codigoUsuario: string,
        @Body() updateAlunoDto: UpdateAlunoDto,
    ) {
        await this.usuarioService.updateAlunoDashboard(
            codigoUsuario,
            updateAlunoDto,
        );
        return new DefaultResponseDTO({}, 'Usuário atualizado com sucesso!');
    }

    @Put('/coordenador/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCoordenadorDashboard(
        @Param('codigo') codigoUsuario: string,
        @Body() updateCoordenadorDto: UpdateCoordenadorDto,
    ) {
        await this.usuarioService.updateAlunoDashboard(
            codigoUsuario,
            updateCoordenadorDto,
        );
        return new DefaultResponseDTO({}, 'Usuário atualizado com sucesso!');
    }

    @Put('/:codigo/update')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        @Param('codigo') codigoUsuario: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        await this.usuarioService.updateUser(codigoUsuario, updateUsuarioDto);
        return new DefaultResponseDTO({}, 'Usuário atualizado com sucesso!');
    }

    @Delete('/:codigo/delete')
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteUser(@Param('codigo') codigo: string) {
        await this.usuarioService.deleteUser(codigo);
        return new DefaultResponseDTO({}, 'Usuário removido com sucesso!');
    }
}
