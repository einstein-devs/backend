import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  senha: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsOptional()
  novaSenha: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsOptional()
  confirmacaoNovaSenha: string;
}
