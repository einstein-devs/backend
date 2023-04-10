import { OmitType, PartialType } from '@nestjs/swagger';
import { CargoPosicao } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UsuarioDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  senha: string;

  @IsNotEmpty()
  @IsStrongPassword()
  confirmarSenha: string;
}
