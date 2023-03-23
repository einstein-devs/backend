import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { usuario } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'codigo',
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
