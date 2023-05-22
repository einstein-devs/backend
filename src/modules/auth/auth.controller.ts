import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('AuthController')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/auth')
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

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    @HttpCode(HttpStatus.OK)
    async findMe(@Req() req) {
        const usuarioId = req.user.id;
        const usuario = await this.authService.findMe(usuarioId);
        return new DefaultResponseDTO(usuario);
    }
}
