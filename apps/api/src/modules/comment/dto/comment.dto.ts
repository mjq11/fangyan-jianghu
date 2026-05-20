import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entryId?: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: ['normal', 'suggestion', 'correction'], default: 'normal' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correction?: string;
}

export class QueryCommentDto {
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
}