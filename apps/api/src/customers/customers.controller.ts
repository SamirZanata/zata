import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('customers')
@Controller('companies/:companyId/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar clientes de uma empresa',
    description: 'Retorna todos os clientes/tomadores cadastrados para uma empresa específica',
  })
  @ApiParam({
    name: 'companyId',
    description: 'ID da empresa',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  findAll(@Param('companyId') companyId: string) {
    return this.customersService.findAllByCompany(companyId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo cliente',
    description: 'Cria um novo cliente/tomador para a empresa especificada',
  })
  @ApiParam({
    name: 'companyId',
    description: 'ID da empresa',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  create(
    @Param('companyId') companyId: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(companyId, createCustomerDto);
  }
}

