import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar notas fiscais',
    description: 'Retorna todas as notas fiscais. Opcionalmente filtra por companyId',
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'ID da empresa para filtrar as notas',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notas fiscais retornada com sucesso',
  })
  findAll(@Query('companyId') companyId?: string) {
    return this.invoicesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar nota fiscal por ID',
    description: 'Retorna os dados de uma nota fiscal específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da nota fiscal',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Nota fiscal não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post(':id/emit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Emitir nota fiscal',
    description: 'Envia uma nota fiscal em status DRAFT para processamento assíncrono',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da nota fiscal',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal enviada para processamento',
  })
  @ApiResponse({
    status: 400,
    description: 'Nota fiscal não está em status DRAFT',
  })
  @ApiResponse({
    status: 404,
    description: 'Nota fiscal não encontrada',
  })
  emit(@Param('id') id: string) {
    console.log(`[InvoicesController] Recebida requisição para emitir nota: ${id}`);
    return this.invoicesService.emit(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova nota fiscal',
    description: 'Cria uma nova nota fiscal em status DRAFT',
  })
  @ApiResponse({
    status: 201,
    description: 'Nota fiscal criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa ou cliente não encontrado',
  })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }
}

