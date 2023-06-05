import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAlunoDto {
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNotEmpty()
    @IsOptional()
    nome?: string;

    @IsNotEmpty()
    @IsOptional()
    cursoId?: string;
}
