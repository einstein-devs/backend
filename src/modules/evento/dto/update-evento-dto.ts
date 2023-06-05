import { Type } from 'class-transformer';
import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateEventoDTO {
    @IsNotEmpty()
    @IsOptional()
    titulo: string;

    @IsNotEmpty()
    @IsOptional()
    descricao: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    @IsOptional()
    dataHoraInicio: Date;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    @IsOptional()
    dataHoraTermino: Date;
}
