import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'contato@devmei.com',
    description: 'Email da empresa',
    required: true,
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha da empresa',
    required: true,
  })
  @IsString()
  password: string;
}

