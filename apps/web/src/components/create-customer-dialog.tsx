'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { customerSchema, CustomerFormData } from '@/src/schemas/customer-schema';
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

interface CreateCustomerDialogProps {
  companyId: string;
}

export function CreateCustomerDialog({ companyId }: CreateCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyId,
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      // Remove campos vazios antes de enviar
      const payload = {
        name: data.name,
        document: data.document,
        ...(data.email && data.email.trim() !== '' && { email: data.email }),
        ...(data.phone && data.phone.trim() !== '' && { phone: data.phone }),
        ...(data.addressStreet && data.addressStreet.trim() !== '' && { addressStreet: data.addressStreet }),
        ...(data.addressCity && data.addressCity.trim() !== '' && { addressCity: data.addressCity }),
      };

      const response = await fetch(`http://localhost:3333/companies/${companyId}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro ao criar cliente' }));
        throw new Error(error.message || 'Erro ao criar cliente');
      }

      // Sucesso: fecha o modal, reseta o formulário e atualiza a lista
      setOpen(false);
      reset();
      router.refresh(); // Atualiza a lista sem recarregar a página
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      window.alert(
        error instanceof Error
          ? error.message
          : 'Erro ao criar cliente. Tente novamente.'
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
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente / Tomador</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="João Silva"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">
              CPF ou CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="document"
              placeholder="123.456.789-00 ou 00.000.000/0001-91"
              {...register('document')}
            />
            {errors.document && (
              <p className="text-sm text-red-500">{errors.document.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 98765-4321"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Logradouro</Label>
              <Input
                id="addressStreet"
                placeholder="Rua das Flores"
                {...register('addressStreet')}
              />
              {errors.addressStreet && (
                <p className="text-sm text-red-500">
                  {errors.addressStreet.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressCity">Cidade</Label>
              <Input
                id="addressCity"
                placeholder="São Paulo"
                {...register('addressCity')}
              />
              {errors.addressCity && (
                <p className="text-sm text-red-500">{errors.addressCity.message}</p>
              )}
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

