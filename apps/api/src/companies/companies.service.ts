import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      select: {
        id: true,
        cnpj: true,
        legalName: true,
        tradeName: true,
        email: true,
        municipalRegistration: true,
        taxRegime: true,
        certificateStoragePath: true,
        certificatePasswordIv: true,
        certificatePasswordContent: true,
        certificateExpiry: true,
        addressStreet: true,
        addressNumber: true,
        addressZip: true,
        addressCity: true,
        addressState: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        cnpj: true,
        legalName: true,
        tradeName: true,
        email: true,
        municipalRegistration: true,
        taxRegime: true,
        certificateStoragePath: true,
        certificatePasswordIv: true,
        certificatePasswordContent: true,
        certificateExpiry: true,
        addressStreet: true,
        addressNumber: true,
        addressZip: true,
        addressCity: true,
        addressState: true,
        createdAt: true,
        updatedAt: true,
        customers: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Garante que customers sempre seja um array, mesmo se null
    if (company && company.customers === null) {
      company.customers = [];
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto) {
    // Remove formatação do CNPJ antes de salvar
    const cleanCNPJ = createCompanyDto.cnpj.replace(/[^\d]/g, '');

    // Hash da senha antes de salvar (Security First)
    const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);

    const data: any = {
      cnpj: cleanCNPJ,
      legalName: createCompanyDto.legalName,
      email: createCompanyDto.email,
      password: hashedPassword,
      taxRegime: (createCompanyDto.taxRegime as any) || 'MEI',
    };

    // Adiciona campos opcionais apenas se existirem
    if (createCompanyDto.tradeName) data.tradeName = createCompanyDto.tradeName;
    if (createCompanyDto.municipalRegistration) data.municipalRegistration = createCompanyDto.municipalRegistration;
    if (createCompanyDto.addressStreet) data.addressStreet = createCompanyDto.addressStreet;
    if (createCompanyDto.addressNumber) data.addressNumber = createCompanyDto.addressNumber;
    if (createCompanyDto.addressZip) data.addressZip = createCompanyDto.addressZip;
    if (createCompanyDto.addressCity) data.addressCity = createCompanyDto.addressCity;
    if (createCompanyDto.addressState) data.addressState = createCompanyDto.addressState;

    const company = await this.prisma.company.create({ data });
    
    // Remove a senha antes de retornar
    const { password: _, ...result } = company;
    return result;
  }
}

