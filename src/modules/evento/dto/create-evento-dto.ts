import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    codigo?: string;

    @IsString()
    @IsNotEmpty()
    localId: string;

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
