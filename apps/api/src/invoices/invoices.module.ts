import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesProcessor } from './invoices.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'invoices',
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesProcessor],
})
export class InvoicesModule {}

