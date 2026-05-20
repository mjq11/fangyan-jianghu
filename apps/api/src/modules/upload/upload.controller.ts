import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('presigned-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取预签名上传URL' })
  async getPresignedUrl(
    @Body() body: { fileName: string; mimeType: string },
    @Request() req: { user: { id: string } },
  ) {
    return this.uploadService.getUploadUrl(body.fileName, body.mimeType, req.user.id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '验证音频文件' })
  async validateAudio(@Body() body: { mimeType: string; size: number }) {
    const isValid = this.uploadService.validateAudioFile(body.mimeType, body.size);
    return { valid: isValid };
  }
}