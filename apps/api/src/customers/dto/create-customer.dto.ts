import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do cliente/tomador',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF ou CNPJ do cliente (sem formatação ou formatado)',
    required: true,
  })
  @IsString()
  document: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do cliente',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Telefone do cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Logradouro do endereço',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressStreet?: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade do endereço',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressCity?: string;
}

