import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class eventDTO {
  @IsNotEmpty()
  codigo: string;

  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  descricao: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dataHoraInicio: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dataHoraTermino: Date;
}
