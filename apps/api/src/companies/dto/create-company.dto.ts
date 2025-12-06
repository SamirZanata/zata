import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCNPJ } from '../../utils/validators/is-cnpj.validator';

export class CreateCompanyDto {
  // Identificação
  @ApiProperty({
    example: '00.000.000/0001-91',
    description: 'CNPJ válido do MEI (aceita com ou sem formatação)',
    required: true,
  })
  @IsCNPJ({ message: 'CNPJ inválido. Deve ser um CNPJ válido com dígito verificador correto.' })
  @IsString()
  cnpj: string; // Apenas números ou formatado

  @ApiProperty({
    example: 'Dev MEI Ltda',
    description: 'Razão Social da empresa',
    required: true,
  })
  @IsString()
  legalName: string; // Razão Social

  @ApiProperty({
    example: 'Dev MEI',
    description: 'Nome Fantasia (Opcional para MEI)',
    required: false,
  })
  @IsOptional()
  @IsString()
  tradeName?: string; // Nome Fantasia (Opcional para MEI)

  @ApiProperty({
    example: 'contato@devmei.com',
    description: 'Email comercial da empresa',
    required: true,
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string; // Email comercial

  // Dados Fiscais
  @ApiProperty({
    example: '123456789',
    description: 'Inscrição Municipal (Obrigatório para emissão de NFS-e)',
    required: false,
  })
  @IsOptional()
  @IsString()
  municipalRegistration?: string; // Inscrição Municipal (Obrigatório para NFS-e)

  @ApiProperty({
    enum: ['MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO'],
    example: 'MEI',
    description: 'Regime tributário da empresa. Default: MEI',
    required: false,
  })
  @IsOptional()
  @IsEnum(['MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO'], {
    message: 'TaxRegime deve ser MEI, SIMPLES_NACIONAL ou LUCRO_PRESUMIDO',
  })
  taxRegime?: 'MEI' | 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO'; // Default: MEI

  // Endereço (Necessário para Nota Fiscal)
  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Logradouro do endereço',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressStreet?: string;

  @ApiProperty({
    example: '123',
    description: 'Número do endereço',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressNumber?: string;

  @ApiProperty({
    example: '01310-100',
    description: 'CEP (Código de Endereçamento Postal)',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressZip?: string; // CEP

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade do endereço',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressCity?: string;

  @ApiProperty({
    example: 'SP',
    description: 'UF (Unidade Federativa) - 2 letras',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressState?: string; // UF (2 letras)

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha da empresa para autenticação',
    required: true,
  })
  @IsString()
  password: string; // Senha para autenticação
}

