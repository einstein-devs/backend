import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
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
    async loginUsuario(@Req() req, @Res() res) {
        const token = await this.authService.login(req.user);
        return res
            .status(200)
            .json(new DefaultResponseDTO({ user: req.user, token }));
    }
}
