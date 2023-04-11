import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsPostPresencaDTO {
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  eventoId: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;
}
