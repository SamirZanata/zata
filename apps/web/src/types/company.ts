export type TaxRegime = 'MEI' | 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO';

export interface Company {
  id: string;
  cnpj: string;
  legalName: string;
  tradeName?: string | null;
  email: string;
  municipalRegistration?: string | null;
  taxRegime: TaxRegime;
  certificateStoragePath?: string | null;
  certificatePasswordIv?: string | null;
  certificatePasswordContent?: string | null;
  certificateExpiry?: string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressZip?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  createdAt: string;
  updatedAt: string;
}

