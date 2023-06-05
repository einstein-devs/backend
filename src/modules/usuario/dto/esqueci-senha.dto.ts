import { IsEmail, IsNotEmpty } from 'class-validator';

export class EsqueciSenhaDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
