import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface InvoiceJobData {
  invoiceId: string;
}

@Processor('invoices')
@Injectable()
export class InvoicesProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<InvoiceJobData>) {
    const { invoiceId } = job.data;

    console.log(`[InvoicesProcessor] Processando emissão da nota ${invoiceId}...`);

    // Simula delay da API da prefeitura (3 segundos)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Gera número fictício de nota (formato: YYYY + sequencial de 6 dígitos)
    const year = new Date().getFullYear();
    const sequential = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');
    const invoiceNumber = `${year}${sequential}`;

    // Atualiza a invoice no banco
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'AUTHORIZED',
        invoiceNumber,
        issuedAt: new Date(),
      },
    });

    console.log(
      `[InvoicesProcessor] Nota emitida com sucesso: ${invoiceId} - Número: ${invoiceNumber}`
    );

    return updatedInvoice;
  }
}

