import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyLocaisDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    search?: string;
}
