// FindManyCentrosDto
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyCentrosDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    search?: string;
}
