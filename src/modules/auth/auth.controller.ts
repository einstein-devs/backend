import {
  Controller,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('AuthController')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiBody({
    required: true,
    schema: {
      default: {
        codigo: 'codigo_aqui',
        senha: 'senha_aqui',
      },
    },
  })
  @ApiOkResponse({
    description: 'Quando login valido, retornara token de usuario',
  })
  @ApiUnauthorizedResponse({
    description:
      'Quando login invalido, retorna a mensagem: Código ou senha inválidos',
  })
  async loginUsuario(
    @Req() req,
    @Res() res,
  ): Promise<DefaultResponseDTO<string>> {
    const token = await this.authService.login(req.user);

    const retornoJson = new DefaultResponseDTO<string>(token);

    return res.status(200).json(retornoJson);
  }
}
