import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { usuario } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'ra',
            passwordField: 'senha',
        });
    }

    async validate(codigo: string, senha: string): Promise<usuario> {
        const usuario = await this.authService.validateUser(codigo, senha);
        if (!usuario) {
            throw new UnauthorizedException('Código ou senha inválidos');
        }
        return usuario;
    }
}
