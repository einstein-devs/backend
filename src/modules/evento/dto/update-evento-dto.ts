import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateEventoDTO {
    @IsNumber()
    id: string;

    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    descricao: string;
}
