export interface Customer {
  id: string;
  companyId: string;
  name: string;
  document: string;
  email?: string | null;
  phone?: string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
  createdAt: string;
  updatedAt: string;
}

