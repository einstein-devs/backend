import { OmitType, PartialType } from '@nestjs/swagger';
import { CargoPosicao } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
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
    @IsNumber()
    @Type(() => Number)
    cursoid: string;

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
