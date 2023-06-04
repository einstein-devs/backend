import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email: string;

    @IsNotEmpty()
    @IsString()
    senha: string;

    @IsNotEmpty()
    @IsOptional()
    novaSenha: string;

    @IsNotEmpty()
    @IsOptional()
    confirmacaoNovaSenha: string;
}
