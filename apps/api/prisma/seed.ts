import { PrismaClient, TaxRegime } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verifica se já existe uma empresa
  const existingCompany = await prisma.company.findFirst({
    where: {
      cnpj: '00000000000191', // CNPJ sem formatação
    },
  });

  // Senha padrão para a empresa demo: "admin123"
  const defaultPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  if (existingCompany) {
    // Atualiza a senha se a empresa já existe (caso tenha sido criada antes do campo password)
    if (!existingCompany.password) {
      console.log('🔄 Empresa existe mas sem senha. Atualizando senha...');
      await prisma.company.update({
        where: { id: existingCompany.id },
        data: { password: hashedPassword },
      });
      console.log('✅ Senha atualizada com sucesso!');
    } else {
      // Verifica se a senha atual está correta
      const isPasswordValid = await bcrypt.compare(defaultPassword, existingCompany.password);
      if (!isPasswordValid) {
        console.log('🔄 Senha da empresa não corresponde. Atualizando senha...');
        await prisma.company.update({
          where: { id: existingCompany.id },
          data: { password: hashedPassword },
        });
        console.log('✅ Senha atualizada com sucesso!');
      } else {
        console.log('✅ Empresa demo já existe com senha correta.');
      }
    }
    console.log('🔐 Credenciais de acesso:');
    console.log('   Email: admin@devmei.com');
    console.log('   Senha: admin123');
    return;
  }

  // Cria empresa demo
  const demoCompany = await prisma.company.create({
    data: {
      cnpj: '00000000000191', // CNPJ válido de teste (Banco do Brasil)
      legalName: 'Dev MEI Ltda',
      tradeName: 'Dev MEI',
      email: 'admin@devmei.com',
      taxRegime: TaxRegime.MEI,
      password: hashedPassword,
      municipalRegistration: '123456789',
      addressStreet: 'Rua das Flores',
      addressNumber: '123',
      addressZip: '01310100',
      addressCity: 'São Paulo',
      addressState: 'SP',
    },
  });

  console.log('✅ Empresa demo criada:', {
    id: demoCompany.id,
    cnpj: demoCompany.cnpj,
    legalName: demoCompany.legalName,
    email: demoCompany.email,
  });

  console.log('🔐 Credenciais de acesso:');
  console.log('   Email: admin@devmei.com');
  console.log('   Senha: admin123');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

