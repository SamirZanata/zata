'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { companySchema, CompanyFormData } from '@/src/schemas/company-schema';
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

export function CreateCompanyDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      taxRegime: 'MEI',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3333/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar empresa');
      }

      // Sucesso: fecha o modal, reseta o formulário e atualiza a lista
      setOpen(false);
      reset();
      router.refresh(); // Atualiza a lista sem recarregar a página
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      window.alert(
        error instanceof Error
          ? error.message
          : 'Erro ao criar empresa. Tente novamente.'
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
          Nova Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Empresa</DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">
                CNPJ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0001-91"
                {...register('cnpj')}
              />
              {errors.cnpj && (
                <p className="text-sm text-red-500">{errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRegime">Regime Tributário</Label>
              <Select id="taxRegime" {...register('taxRegime')}>
                <option value="MEI">MEI</option>
                <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
              </Select>
              {errors.taxRegime && (
                <p className="text-sm text-red-500">{errors.taxRegime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalName">
              Razão Social <span className="text-red-500">*</span>
            </Label>
            <Input
              id="legalName"
              placeholder="Empresa MEI Ltda"
              {...register('legalName')}
            />
            {errors.legalName && (
              <p className="text-sm text-red-500">{errors.legalName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradeName">Nome Fantasia</Label>
            <Input
              id="tradeName"
              placeholder="Nome Fantasia (opcional)"
              {...register('tradeName')}
            />
            {errors.tradeName && (
              <p className="text-sm text-red-500">{errors.tradeName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
            <Input
              id="municipalRegistration"
              placeholder="123456789"
              {...register('municipalRegistration')}
            />
            {errors.municipalRegistration && (
              <p className="text-sm text-red-500">
                {errors.municipalRegistration.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressZip">CEP</Label>
              <Input
                id="addressZip"
                placeholder="01310-100"
                {...register('addressZip')}
              />
              {errors.addressZip && (
                <p className="text-sm text-red-500">{errors.addressZip.message}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressNumber">Número</Label>
              <Input
                id="addressNumber"
                placeholder="123"
                {...register('addressNumber')}
              />
              {errors.addressNumber && (
                <p className="text-sm text-red-500">
                  {errors.addressNumber.message}
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

            <div className="space-y-2">
              <Label htmlFor="addressState">UF</Label>
              <Input
                id="addressState"
                placeholder="SP"
                maxLength={2}
                {...register('addressState')}
              />
              {errors.addressState && (
                <p className="text-sm text-red-500">
                  {errors.addressState.message}
                </p>
              )}
            </div>
          </div>

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

