import { IsString, IsUrl, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { PrismaClient } from "@prisma/client";

export class LocalDto {


  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descricao: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  urlImagem: string;
}
