'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { showToast } from '@/src/components/ui/toast';
import { getAuthHeadersClient } from '@/src/lib/api-client-client';

interface EmitInvoiceButtonProps {
  invoiceId: string;
  status: string;
}

export function EmitInvoiceButton({ invoiceId, status }: EmitInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Só mostra o botão se o status for DRAFT
  if (status !== 'DRAFT') {
    return null;
  }

  const handleEmit = async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeadersClient();
      const response = await fetch(`http://localhost:3333/invoices/${invoiceId}/emit`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Erro ao emitir nota fiscal',
        }));
        throw new Error(error.message || 'Erro ao emitir nota fiscal');
      }

      showToast('Processamento iniciado! A nota será emitida em breve.', 'success');
      router.refresh(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      showToast(
        error instanceof Error ? error.message : 'Erro ao emitir nota fiscal. Tente novamente.',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEmit}
      disabled={isLoading}
      size="sm"
      variant="default"
    >
      {isLoading ? 'Emitindo...' : 'Emitir Agora'}
    </Button>
  );
}

