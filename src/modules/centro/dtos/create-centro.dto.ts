import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCentroDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ementa?: string;

    @IsString()
    @IsNotEmpty()
    cursoId: string;

    @IsString()
    @IsNotEmpty()
    diretorId: string;
}
