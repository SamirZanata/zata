import { z } from 'zod';

// Regex básico para CNPJ (aceita formatado ou não)
const cnpjRegex = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14})$/;

export const companySchema = z.object({
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .regex(cnpjRegex, 'CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX ou apenas números'),
  legalName: z
    .string()
    .min(3, 'Razão Social deve ter no mínimo 3 caracteres')
    .max(255, 'Razão Social deve ter no máximo 255 caracteres'),
  tradeName: z
    .string()
    .max(255, 'Nome Fantasia deve ter no máximo 255 caracteres')
    .optional(),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  municipalRegistration: z
    .string()
    .max(50, 'Inscrição Municipal deve ter no máximo 50 caracteres')
    .optional(),
  taxRegime: z.enum(['MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO'], {
    errorMap: () => ({ message: 'Regime tributário inválido' }),
  }).optional(),
  addressStreet: z
    .string()
    .max(255, 'Logradouro deve ter no máximo 255 caracteres')
    .optional(),
  addressNumber: z
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .optional(),
  addressZip: z
    .string()
    .max(10, 'CEP deve ter no máximo 10 caracteres')
    .optional(),
  addressCity: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional(),
  addressState: z
    .string()
    .length(2, 'UF deve ter exatamente 2 caracteres')
    .optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;

