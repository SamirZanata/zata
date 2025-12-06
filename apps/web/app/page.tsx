import Link from 'next/link';
import { Company } from '@/src/types/company';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { CreateCompanyDialog } from '@/src/components/create-company-dialog';
import { LogoutButton } from '@/src/components/logout-button';
import { getAuthHeaders } from '@/src/lib/api-client';

async function getCompanies(): Promise<Company[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

    const headers = await getAuthHeaders();

    const res = await fetch('http://localhost:3333/companies', {
      cache: 'no-store',
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Falha ao buscar empresas: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Timeout ao buscar empresas: A API demorou muito para responder');
      } else if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        console.error('Erro de conexão: Verifique se o backend está rodando em http://localhost:3333');
      } else {
        console.error('Erro ao buscar empresas:', error.message);
      }
    } else {
      console.error('Erro desconhecido ao buscar empresas:', error);
    }
    return [];
  }
}

function formatCNPJ(cnpj: string): string {
  // Remove formatação existente
  const clean = cnpj.replace(/\D/g, '');
  
  // Aplica formatação: XX.XXX.XXX/XXXX-XX
  return clean.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export default async function Home() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Empresas MEI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie suas empresas cadastradas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreateCompanyDialog />
            <LogoutButton />
          </div>
        </div>

        {companies.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma empresa encontrada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A API pode estar offline ou não há empresas cadastradas.
                </p>
                <p className="text-xs text-muted-foreground">
                  Certifique-se de que o backend está rodando em{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">http://localhost:3333</code>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {company.legalName}
                        </CardTitle>
                        {company.tradeName && (
                          <CardDescription className="text-sm">
                            {company.tradeName}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        variant={
                          company.taxRegime === 'MEI'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {company.taxRegime}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
