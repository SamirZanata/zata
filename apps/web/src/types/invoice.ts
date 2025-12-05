export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PROCESSING'
  | 'AUTHORIZED'
  | 'ERROR'
  | 'CANCELED';

export interface Invoice {
  id: string;
  companyId: string;
  customerId: string;
  amount: string; // Decimal vem como string do Prisma
  description: string;
  serviceCode: string;
  status: InvoiceStatus;
  externalId?: string | null;
  invoiceNumber?: string | null;
  verificationCode?: string | null;
  pdfUrl?: string | null;
  xmlUrl?: string | null;
  issuedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    legalName: string;
    cnpj: string;
  };
  customer?: {
    id: string;
    name: string;
    document: string;
    email?: string | null;
  };
}

