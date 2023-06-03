import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCursoDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ementa?: string;

    @IsString()
    @IsNotEmpty()
    centroId: string;
}
