import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ParamsPostPresencaDTO {
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  eventoId: number;
}
