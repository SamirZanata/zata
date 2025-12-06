import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'DEV_SECRET',
    });
  }

  async validate(payload: any) {
    const company = await this.prisma.company.findUnique({
      where: { id: payload.sub },
    });

    if (!company) {
      throw new UnauthorizedException();
    }

    // Remove a senha do objeto antes de retornar
    const { password: _, ...result } = company;
    return result;
  }
}

