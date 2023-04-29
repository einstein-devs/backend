import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

export class UpdateLocalDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    descricao: string;

    @IsUrl()
    @IsOptional()
    urlImagem: string;
}
