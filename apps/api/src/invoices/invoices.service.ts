import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Prisma } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('invoices') private readonly invoicesQueue: Queue,
  ) {}

  async findAll(companyId?: string) {
    const where: Prisma.InvoiceWhereInput = companyId ? { companyId } : {};
    
    return this.prisma.invoice.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            legalName: true,
            cnpj: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            legalName: true,
            cnpj: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            document: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }

    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    // Verifica se a empresa existe
    const company = await this.prisma.company.findUnique({
      where: { id: createInvoiceDto.companyId },
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${createInvoiceDto.companyId} não encontrada`);
    }

    // Verifica se o cliente existe
    const customer = await this.prisma.customer.findUnique({
      where: { id: createInvoiceDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${createInvoiceDto.customerId} não encontrado`);
    }

    // Verifica se o cliente pertence à empresa
    if (customer.companyId !== createInvoiceDto.companyId) {
      throw new NotFoundException('Cliente não pertence à empresa especificada');
    }

    // Converte amount para Decimal usando Prisma
    return this.prisma.invoice.create({
      data: {
        companyId: createInvoiceDto.companyId,
        customerId: createInvoiceDto.customerId,
        amount: new Prisma.Decimal(createInvoiceDto.amount),
        description: createInvoiceDto.description,
        serviceCode: createInvoiceDto.serviceCode,
        status: 'DRAFT', // Status padrão
      },
      include: {
        company: {
          select: {
            id: true,
            legalName: true,
            cnpj: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
      },
    });
  }

  async emit(id: string) {
    // Busca a invoice
    const invoice = await this.findOne(id);

    // Valida se o status é DRAFT
    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException(
        `Apenas notas com status DRAFT podem ser emitidas. Status atual: ${invoice.status}`,
      );
    }

    // Atualiza status para PENDING
    await this.prisma.invoice.update({
      where: { id },
      data: { status: 'PENDING' },
    });

    // Adiciona job na fila
    await this.invoicesQueue.add('emit-invoice', {
      invoiceId: id,
    });

    return {
      message: 'Nota fiscal enviada para processamento',
      invoiceId: id,
    };
  }
}

