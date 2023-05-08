import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificadoDto {
    @IsString()
    @IsNotEmpty()
    eventoId: string;

    @IsString()
    @IsNotEmpty()
    codigoEvento: string;
}
