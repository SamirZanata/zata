import { Controller, Post, Body, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as empresas',
    description: 'Retorna uma lista de todas as empresas cadastradas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas retornada com sucesso',
  })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar empresa por ID',
    description: 'Retorna os dados de uma empresa específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova empresa',
    description: 'Cria uma nova empresa MEI com validação de CNPJ e dados fiscais brasileiros',
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa criada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        cnpj: '00000000000191',
        legalName: 'Dev MEI Ltda',
        tradeName: 'Dev MEI',
        email: 'contato@devmei.com',
        taxRegime: 'MEI',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos (CNPJ inválido, email inválido, etc.)',
    schema: {
      example: {
        statusCode: 400,
        message: ['CNPJ inválido. Deve ser um CNPJ válido com dígito verificador correto.'],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }
}

