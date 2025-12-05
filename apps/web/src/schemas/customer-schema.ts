import { z } from 'zod';

// Regex básico para CPF ou CNPJ (aceita formatado ou não)
const documentRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{11}|\d{14})$/;

export const customerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  document: z
    .string()
    .min(1, 'CPF ou CNPJ é obrigatório')
    .regex(documentRegex, 'CPF ou CNPJ inválido. Use o formato correto ou apenas números'),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  addressStreet: z
    .string()
    .max(255, 'Logradouro deve ter no máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
  addressCity: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

