import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyEventosDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    search?: string;
}
