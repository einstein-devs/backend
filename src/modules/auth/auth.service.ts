import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { usuario } from '@prisma/client';
import { compare, compareSync, hash } from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(codigo: string, senha: string): Promise<usuario | null> {
    try {
      const usuario = await this.usuarioService.findOne(codigo);

      const senhaCompativel = compareSync(senha, usuario.senha);

      if (usuario && senhaCompativel) {
        return usuario;
      }

      return null;
    } catch {
      return null;
    }
  }

  async login(usuario: usuario): Promise<string> {
    const payload = { codigo: usuario.codigo, sub: usuario.id };
    return await this.jwtService.signAsync(payload);
  }
}
