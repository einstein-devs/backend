import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioService } from 'src/modules/usuario/usuario.service';

@Injectable()
export class CargoGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly usuarioService: UsuarioService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const cargos = this.reflector.get<string[]>(
            'cargos',
            context.getHandler(),
        );
        if (!cargos) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return await this.usuarioService.hasCargoPermission({
            cargos: cargos,
            idUsuario: user.id,
        });
    }
}
