import { IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'fangyan_user' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '13800138000' })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: '邮箱格式不正确' })
  email?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'fangyan_user 或手机号 或邮箱' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}