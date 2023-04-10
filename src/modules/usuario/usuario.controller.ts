import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Request,
  Res,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';

import { usuario } from '@prisma/client';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { UsuarioDto } from './dto/usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('UsuarioController')
@Controller('/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

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
        codigo: 'CODIGO',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('codigo') codigo: string) {
    const usuario = await this.usuarioService.findOne(codigo);

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
        nome: 'nome',
        email: 'email',
        senha: 'senha',
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
        codigo: 'codigo',
        nome: 'nome',
        email: 'email',
        senha: 'senha',
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
      default: {
        codigo: 'codigo',
      },
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(@Param('codigo') codigo: string) {
    await this.usuarioService.deleteUser(codigo);
    return new DefaultResponseDTO({}, 'Usuário removido com sucesso!');
  }
}
