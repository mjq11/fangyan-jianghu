import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('用户名或手机号已存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        phone: dto.phone,
        email: dto.email,
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id);

    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.login },
          { phone: dto.login },
          { email: dto.login },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        role: true,
        avatar: true,
        isVip: true,
        points: true,
      },
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fangyan-refresh-secret',
      });

      return this.generateTokens(payload.sub);
    } catch {
      throw new UnauthorizedException('Refresh token 无效');
    }
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'fangyan-jianghu-secret-2024',
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'fangyan-refresh-secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}