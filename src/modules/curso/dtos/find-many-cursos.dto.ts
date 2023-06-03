import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyCursosDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    search?: string;
}
