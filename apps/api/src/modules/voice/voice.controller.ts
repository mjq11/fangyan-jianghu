import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VoiceService } from './voice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('voice')
@Controller('voice')
export class VoiceController {
  constructor(private voiceService: VoiceService) {}

  @Get('entry/:entryId')
  @ApiOperation({ summary: '获取词条关联的语音' })
  async findByEntryId(@Param('entryId') entryId: string) {
    return this.voiceService.findByEntryId(entryId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取语音详情' })
  async findById(@Param('id') id: string) {
    return this.voiceService.findById(id);
  }

  @Put(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞/取消点赞语音' })
  async like(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.voiceService.like(id, req.user.id);
  }
}