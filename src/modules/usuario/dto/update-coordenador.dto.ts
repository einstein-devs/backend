import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCoordenadorDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()

    cursoId?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    
    nome?: string;

    @IsNotEmpty()
    @IsEmail()
    @IsOptional()

    email?: string;
}
