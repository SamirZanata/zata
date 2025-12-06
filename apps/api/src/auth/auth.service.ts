import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`[AuthService] Tentativa de login com email: ${email}`);
    
    // Busca a empresa pelo email
    const company = await this.prisma.company.findUnique({
      where: { email },
    });

    if (!company) {
      console.log(`[AuthService] Empresa não encontrada para email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log(`[AuthService] Empresa encontrada: ${company.legalName} (${company.email})`);

    // Compara a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      console.log(`[AuthService] Senha inválida para email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log(`[AuthService] Login bem-sucedido para: ${email}`);

    // Remove a senha do objeto antes de retornar
    const { password: _, ...result } = company;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
