import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class eventDTO{
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    descricao: string;

    @IsNotEmpty()
    dataHoraInicio: Date;

    @IsNotEmpty()
    dataHoraTermino: Date;
}