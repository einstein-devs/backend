import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsPostPresencaDTO {
    @IsString()
    @IsNotEmpty()
    eventoId: string;
}
