import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

    @IsDate()
    @IsOptional()
    @IsNotEmpty()
    descricao?: string;

    @IsDate()
    @Transform(({ value }) => {
        const dataRecebida = DateTime.fromJSDate(new Date(value), {
            zone: 'America/Sao_Paulo',
        });
        const dataFormatada = dataRecebida.toFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS",
        );

        return new Date(dataFormatada);
    })
    @IsNotEmpty()
    dataHoraInicio: Date;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => {
        const dataRecebida = DateTime.fromJSDate(new Date(value), {
            zone: 'America/Sao_Paulo',
        });
        const dataFormatada = dataRecebida.toFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS",
        );

        return new Date(dataFormatada);
    })
    @IsNotEmpty()
    dataHoraTermino: Date;
}
