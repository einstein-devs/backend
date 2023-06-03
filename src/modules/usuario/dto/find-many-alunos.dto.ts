import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindManyAlunosDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    search?: string;
}
