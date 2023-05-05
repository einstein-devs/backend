import { SetMetadata } from '@nestjs/common';

export const SomenteCargos = (...roles: string[]) =>
    SetMetadata('cargos', roles);
