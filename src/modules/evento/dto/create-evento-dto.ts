import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsDate,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    localId: string;

    @IsString()
    @IsNotEmpty()
    usuarioId: string;

    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    descricao?: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    dataHoraInicio: Date;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    dataHoraTermino: Date;
}
