import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DefaultResponseDTO<T> {
  @ApiProperty()
  @IsNotEmpty()
  mensagem: string | null | undefined;

  @ApiProperty()
  @IsNotEmpty()
  data: T;

  constructor(data: T, mensagem: string | null | undefined = '') {
    this.mensagem = mensagem;
    this.data = data;
  }
}
