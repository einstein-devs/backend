import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyCursosDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    search?: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    somenteSemCoordenadores: boolean = false;
}
