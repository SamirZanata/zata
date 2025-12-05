import { z } from 'zod';

export const invoiceSchema = z.object({
  companyId: z.string().uuid('ID da empresa inválido'),
  customerId: z.string().uuid('ID do cliente inválido').min(1, 'Cliente é obrigatório'),
  amount: z.coerce
    .number({
      required_error: 'Valor é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .min(0.01, 'Valor deve ser maior que zero')
    .positive('Valor deve ser positivo'),
  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  serviceCode: z
    .string()
    .min(1, 'Código do serviço é obrigatório')
    .default('1.03'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

