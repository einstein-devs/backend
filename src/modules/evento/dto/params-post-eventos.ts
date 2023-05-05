import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsGetEventoDto {
    @IsNotEmpty()
    @IsString()
    codigo: string;
}
