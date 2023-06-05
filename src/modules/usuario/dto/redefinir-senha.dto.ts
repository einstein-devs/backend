import { IsNotEmpty, IsString } from 'class-validator';

export class RedefinirSenhaDto {
    @IsNotEmpty()
    @IsString()
    redefinicaoId: string;

    @IsNotEmpty()
    @IsString()
    novaSenha: string;

    @IsNotEmpty()
    @IsString()
    confirmacaoNovaSenha: string;
}
