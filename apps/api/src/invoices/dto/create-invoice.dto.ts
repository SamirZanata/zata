import { IsString, IsNotEmpty, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da empresa',
    required: true,
  })
  @IsUUID('4', { message: 'companyId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'companyId é obrigatório' })
  companyId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID do cliente/tomador',
    required: true,
  })
  @IsUUID('4', { message: 'customerId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'customerId é obrigatório' })
  customerId: string;

  @ApiProperty({
    example: 150.0,
    description: 'Valor do serviço em reais',
    required: true,
  })
  @IsNumber({}, { message: 'amount deve ser um número' })
  @IsNotEmpty({ message: 'amount é obrigatório' })
  amount: number;

  @ApiProperty({
    example: 'Desenvolvimento de software sob medida',
    description: 'Discriminação do serviço prestado',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'description é obrigatório' })
  description: string;

  @ApiProperty({
    example: '1.03',
    description: 'Código do serviço conforme LC 116 (ex: 1.03 - Programação, 1.07 - Suporte)',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'serviceCode é obrigatório' })
  serviceCode: string;
}

