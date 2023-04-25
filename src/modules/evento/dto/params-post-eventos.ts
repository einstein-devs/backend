import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsGetEvento {
  @IsNotEmpty()
  @IsString()
  codigo: string;
}
