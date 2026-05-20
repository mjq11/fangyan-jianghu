import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto, QueryCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findByEntryId(entryId: string, query: QueryCommentDto) {
    const { page = 1, limit = 20 } = query;

    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { entryId, status: 'published' },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { entryId, status: 'published' } }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateCommentDto, userId: string) {
    return this.prisma.comment.create({
      data: {
        entryId: dto.entryId,
        userId,
        content: dto.content,
        type: dto.type || 'normal',
        originalContent: dto.originalContent,
        correction: dto.correction,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });
  }

  async report(id: string, userId: string, reason: string, detail?: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('留言不存在');
    }

    return this.prisma.report.create({
      data: {
        userId,
        targetId: id,
        targetType: 'comment',
        reason,
        detail,
      },
    });
  }
}