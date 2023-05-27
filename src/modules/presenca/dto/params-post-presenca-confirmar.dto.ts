import { IsNotEmpty, IsString } from 'class-validator';

export class ParamsPostPresencaConfirmarDTO {
    @IsString()
    @IsNotEmpty()
    eventoId: string;

    @IsNotEmpty()
    @IsString()
    codigo: string;
}
