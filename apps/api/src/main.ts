import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuração de Validação Global (Security First)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma automaticamente tipos primitivos
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades não permitidas
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  // 2. Habilita CORS (Crucial para o Front acessar o Back)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 2. Configuração do Swagger (Documentação Visual)
  const config = new DocumentBuilder()
    .setTitle('SaaS MEI Finance API')
    .setDescription('Plataforma Techfin para Microempreendedores')
    .setVersion('1.0')
    .addTag('companies', 'Gerenciamento de empresas MEI')
    .addTag('customers', 'Gerenciamento de clientes/tomadores')
    .addTag('invoices', 'Gerenciamento de notas fiscais (NFS-e)')
    .addTag('auth', 'Autenticação JWT')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 3. Define a porta fixa 3333
  await app.listen(3333);
  console.log('🚀 Backend rodando em: http://localhost:3333/api');
}
bootstrap();