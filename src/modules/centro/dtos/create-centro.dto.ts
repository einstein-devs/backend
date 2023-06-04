import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCentroDto {
    @IsString()
    @IsNotEmpty()
    nome: string;
}
