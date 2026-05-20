import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCurseDto {
  @ApiProperty({ example: '锤子' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'chuí zi' })
  @IsString()
  pinyin: string;

  @ApiProperty({ example: '表示否定、不可能，相当于"才怪"' })
  @IsString()
  meaning: string;

  @ApiProperty({ example: '重庆市' })
  @IsString()
  province: string;

  @ApiProperty({ example: '万州区' })
  @IsString()
  city: string;

  @ApiProperty({ example: '万州区' })
  @IsString()
  county: string;

  @ApiPropertyOptional({ enum: ['CURSE_WORD', 'COMMON_PHRASE', 'EXAMPLE'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['GREEN', 'YELLOW', 'RED'] })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ example: '西南官话' })
  @IsOptional()
  @IsString()
  dialectGroup?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  spicyLevel?: number;
}

export class QueryCurseDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional({ enum: ['CURSE_WORD', 'COMMON_PHRASE', 'EXAMPLE'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['GREEN', 'YELLOW', 'RED'] })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular', 'spicy'], default: 'recent' })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class LikeCurseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: 'like' | 'unlike';
}