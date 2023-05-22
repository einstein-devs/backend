import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsPostPresencaConfirmarDTO {
    @IsString()
    @IsNotEmpty()
    eventoId: string;

    @IsNotEmpty()
    @IsString()
    codigo: string;
}
