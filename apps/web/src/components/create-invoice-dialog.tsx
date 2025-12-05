'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { invoiceSchema, InvoiceFormData } from '@/src/schemas/invoice-schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';

interface CreateInvoiceDialogProps {
  companyId: string;
  customers: Array<{ id: string; name: string; document: string }>;
}

export function CreateInvoiceDialog({
  companyId,
  customers,
}: CreateInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      companyId,
      serviceCode: '1.03',
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3333/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: data.companyId,
          customerId: data.customerId,
          amount: data.amount,
          description: data.description,
          serviceCode: data.serviceCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Erro ao criar nota fiscal',
        }));
        throw new Error(error.message || 'Erro ao criar nota fiscal');
      }

      // Sucesso: fecha o modal, reseta o formulário e atualiza a lista
      setOpen(false);
      reset();
      router.refresh(); // Atualiza a lista sem recarregar a página
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      window.alert(
        error instanceof Error
          ? error.message
          : 'Erro ao criar nota fiscal. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Nota Fiscal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Nota Fiscal (NFS-e)</DialogTitle>
          <DialogDescription>
            Preencha os dados da nota fiscal. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">
              Tomador do Serviço <span className="text-red-500">*</span>
            </Label>
            <Select
              id="customerId"
              {...register('customerId')}
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.document}
                </option>
              ))}
            </Select>
            {errors.customerId && (
              <p className="text-sm text-red-500">{errors.customerId.message}</p>
            )}
            {customers.length === 0 && (
              <p className="text-sm text-yellow-600">
                Nenhum cliente cadastrado. Cadastre um cliente primeiro.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Valor (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="150.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceCode">
                Código do Serviço (LC 116) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="serviceCode"
                placeholder="1.03"
                {...register('serviceCode')}
              />
              {errors.serviceCode && (
                <p className="text-sm text-red-500">{errors.serviceCode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição do Serviço <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente o serviço prestado (mínimo 10 caracteres)"
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Campo oculto para companyId */}
          <input type="hidden" {...register('companyId')} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || customers.length === 0}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

