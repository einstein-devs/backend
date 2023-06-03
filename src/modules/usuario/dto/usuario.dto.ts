import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsuarioDto {
    @IsNotEmpty()
    @IsString()
    cursoId: string;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
