import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DateTime } from 'luxon';

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

    @IsString()
    @Transform(({ value }) => {
        const dataRecebida = DateTime.fromJSDate(new Date(value), {
            zone: 'America/Sao_Paulo',
        });
        const dataFormatada = dataRecebida.toFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS",
        );

        return dataFormatada;
    })
    @IsNotEmpty()
    dataHoraInicio: Date;

    @IsString()
    @Type(() => Date)
    @Transform(({ value }) => {
        const dataRecebida = DateTime.fromJSDate(new Date(value), {
            zone: 'America/Sao_Paulo',
        });
        const dataFormatada = dataRecebida.toFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS",
        );

        return dataFormatada;
    })
    @IsNotEmpty()
    dataHoraTermino: Date;
}
