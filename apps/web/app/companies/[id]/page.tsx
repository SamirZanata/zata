import Link from 'next/link';
import { Company } from '@/src/types/company';
import { Customer } from '@/src/types/customer';
import { Invoice } from '@/src/types/invoice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CreateCustomerDialog } from '@/src/components/create-customer-dialog';
import { CreateInvoiceDialog } from '@/src/components/create-invoice-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { EmitInvoiceButton } from '@/src/components/emit-invoice-button';

async function getCompany(id: string): Promise<Company & { customers: Customer[] } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`http://localhost:3333/companies/${id}`, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      // Tenta ler a resposta como texto primeiro para debug
      const errorText = await res.text().catch(() => '');
      console.error(`Erro HTTP ${res.status} ${res.statusText}:`, errorText || 'Sem conteúdo');
      return null;
    }

    // Lê a resposta como texto primeiro
    const text = await res.text();
    
    if (!text || text.trim() === '') {
      console.error('Resposta vazia do servidor');
      return null;
    }

    // Tenta fazer parse do JSON (não depende do Content-Type header)
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      // Se não for JSON válido, verifica se é HTML (erro do servidor)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('Servidor retornou HTML em vez de JSON. Verifique se o backend está rodando corretamente.');
      } else {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.error('Conteúdo recebido (primeiros 200 chars):', text.substring(0, 200));
      }
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Timeout ao buscar empresa: A API demorou muito para responder');
      } else if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        console.error('Erro de conexão: Verifique se o backend está rodando em http://localhost:3333');
      } else {
        console.error('Erro ao buscar empresa:', error.message);
      }
    } else {
      console.error('Erro desconhecido ao buscar empresa:', error);
    }
    return null;
  }
}

function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

async function getInvoices(companyId: string): Promise<Invoice[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`http://localhost:3333/invoices?companyId=${companyId}`, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const text = await res.text();
    if (!text || text.trim() === '') {
      return [];
    }

    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    return [];
  }
}

function formatDocument(document: string): string {
  const clean = document.replace(/\D/g, '');
  
  // Se tiver 11 dígitos, é CPF
  if (clean.length === 11) {
    return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  
  // Se tiver 14 dígitos, é CNPJ
  if (clean.length === 14) {
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  return document;
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getStatusBadgeVariant(status: Invoice['status']) {
  switch (status) {
    case 'DRAFT':
      return 'outline';
    case 'PENDING':
    case 'PROCESSING':
      return 'secondary';
    case 'AUTHORIZED':
      return 'default';
    case 'ERROR':
      return 'destructive';
    case 'CANCELED':
      return 'outline';
    default:
      return 'outline';
  }
}

function getStatusLabel(status: Invoice['status']): string {
  const labels: Record<Invoice['status'], string> = {
    DRAFT: 'Rascunho',
    PENDING: 'Pendente',
    PROCESSING: 'Processando',
    AUTHORIZED: 'Autorizada',
    ERROR: 'Erro',
    CANCELED: 'Cancelada',
  };
  return labels[status] || status;
}

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Next.js 15+ pode retornar params como Promise
  const resolvedParams = await Promise.resolve(params);
  
  // Busca dados em paralelo
  const [company, invoices] = await Promise.all([
    getCompany(resolvedParams.id),
    getInvoices(resolvedParams.id),
  ]);

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Empresa não encontrada</CardTitle>
              <CardDescription>
                A empresa solicitada não existe ou foi removida.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Cabeçalho da Empresa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{company.legalName}</CardTitle>
            {company.tradeName && (
              <CardDescription className="text-base">
                {company.tradeName}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  CNPJ:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCNPJ(company.cnpj)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {company.email}
                </span>
              </div>
              {company.addressCity && company.addressState && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Localização:
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">
                    {company.addressCity}, {company.addressState}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs: Clientes e Notas Fiscais */}
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="invoices">Notas Fiscais</TabsTrigger>
          </TabsList>

          {/* Tab: Clientes */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Clientes / Tomadores</CardTitle>
                    <CardDescription>
                      {!company.customers || company.customers.length === 0
                        ? 'Nenhum cliente cadastrado ainda'
                        : `${company.customers.length} cliente(s) cadastrado(s)`}
                    </CardDescription>
                  </div>
                  <CreateCustomerDialog companyId={resolvedParams.id} />
                </div>
              </CardHeader>
              <CardContent>
                {!company.customers || company.customers.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Comece adicionando seu primeiro cliente.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Nome
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Documento
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Telefone
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.customers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                              {customer.name}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {formatDocument(customer.document)}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {customer.email || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {customer.phone || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notas Fiscais */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notas Fiscais (NFS-e)</CardTitle>
                    <CardDescription>
                      {invoices.length === 0
                        ? 'Nenhuma nota fiscal cadastrada ainda'
                        : `${invoices.length} nota(s) fiscal(is) cadastrada(s)`}
                    </CardDescription>
                  </div>
                  <CreateInvoiceDialog
                    companyId={resolvedParams.id}
                    customers={
                      company.customers?.map((c) => ({
                        id: c.id,
                        name: c.name,
                        document: c.document,
                      })) || []
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Comece criando sua primeira nota fiscal.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Data
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Cliente
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Valor
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Número
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Descrição
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr
                            key={invoice.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {formatDate(invoice.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                              {invoice.customer?.name || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                {getStatusLabel(invoice.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                              {invoice.invoiceNumber || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
                              {invoice.description}
                            </td>
                            <td className="py-3 px-4">
                              <EmitInvoiceButton invoiceId={invoice.id} status={invoice.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

