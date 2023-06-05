import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class EsqueciSenhaDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    enviarParaDashboard: boolean = false;
}
