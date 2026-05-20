import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto, QueryCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('entry/:entryId')
  @ApiOperation({ summary: '获取词条留言' })
  async findByEntryId(@Param('entryId') entryId: string, @Query() query: QueryCommentDto) {
    return this.commentService.findByEntryId(entryId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发表留言' })
  async create(@Body() dto: CreateCommentDto, @Request() req: { user: { id: string } }) {
    return this.commentService.create(dto, req.user.id);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '举报留言' })
  async report(
    @Param('id') id: string,
    @Body() body: { reason: string; detail?: string },
    @Request() req: { user: { id: string } },
  ) {
    return this.commentService.report(id, req.user.id, body.reason, body.detail);
  }
}