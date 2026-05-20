import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateCurseDto, QueryCurseDto, LikeCurseDto } from './dto/curse.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CurseService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(query: QueryCurseDto) {
    const { page = 1, limit = 20, province, city, county, category, level, keyword, sort = 'recent' } = query;

    const where: Prisma.CurseEntryWhereInput = {
      status: 'APPROVED',
      ...(province && { province }),
      ...(city && { city }),
      ...(county && { county }),
      ...(category && { category }),
      ...(level && { level }),
      ...(keyword && {
        OR: [
          { content: { contains: keyword, mode: 'insensitive' } },
          { meaning: { contains: keyword, mode: 'insensitive' } },
          { pinyin: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.CurseEntryOrderByWithRelationInput = {
      recent: { createdAt: 'desc' },
      popular: { likeCount: 'desc' },
      spicy: { spicyLevel: 'desc' },
    }[sort] || { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.curseEntry.findMany({
        where,
        include: {
          _count: { select: { voices: true, comments: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.curseEntry.count({ where }),
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

  async findById(id: string, userId?: string) {
    const entry = await this.prisma.curseEntry.findUnique({
      where: { id },
      include: {
        voices: {
          where: { reviewStatus: 'HUMAN_PASSED' },
          orderBy: { likeCount: 'desc' },
          take: 5,
        },
        user: {
          select: { id: true, username: true, avatar: true },
        },
        _count: { select: { voices: true, comments: true } },
      },
    });

    if (!entry) {
      throw new NotFoundException('词条不存在');
    }

    let isLiked = false;
    if (userId) {
      const like = await this.prisma.like.findFirst({
        where: { userId, entryId: id, type: 'entry' },
      });
      isLiked = !!like;
    }

    await this.prisma.curseEntry.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });

    return { entry, isLiked };
  }

  async findByCounty(province: string, city: string, county: string, category?: string) {
    const where: Prisma.CurseEntryWhereInput = {
      status: 'APPROVED',
      province,
      city,
      county,
      ...(category && { category }),
    };

    return this.prisma.curseEntry.findMany({
      where,
      orderBy: { spicyLevel: 'desc' },
    });
  }

  async create(dto: CreateCurseDto, userId?: string) {
    const data: Prisma.CurseEntryCreateInput = {
      content: dto.content,
      pinyin: dto.pinyin,
      meaning: dto.meaning,
      province: dto.province,
      city: dto.city,
      county: dto.county,
      category: dto.category || 'CURSE_WORD',
      level: dto.level || 'GREEN',
      dialectGroup: dto.dialectGroup,
      source: userId ? 'user_submitted' : 'ai_generated',
      status: userId ? 'PENDING' : 'AI_GENERATED',
      spicyLevel: dto.spicyLevel || 1,
      ...(userId && { user: { connect: { id: userId } } }),
    };

    return this.prisma.curseEntry.create({ data });
  }

  async like(id: string, userId: string, dto: LikeCurseDto) {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, entryId: id, type: 'entry' },
    });

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      await this.prisma.curseEntry.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    }

    await this.prisma.like.create({
      data: { userId, entryId: id, type: 'entry' },
    });
    await this.prisma.curseEntry.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });

    return { liked: true };
  }

  async getRandom() {
    const count = await this.prisma.curseEntry.count({ where: { status: 'APPROVED' } });
    if (count === 0) {
      throw new NotFoundException('暂无数据');
    }

    const random = Math.floor(Math.random() * count);
    const entry = await this.prisma.curseEntry.findFirst({
      where: { status: 'APPROVED' },
      skip: random,
      include: {
        voices: { where: { reviewStatus: 'HUMAN_PASSED' }, take: 1 },
      },
    });

    if (!entry) {
      throw new NotFoundException('暂无数据');
    }

    return entry;
  }

  async getStats() {
    const cacheKey = 'stats:curse';
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [totalEntries, totalVoices, totalUsers, byProvince] = await Promise.all([
      this.prisma.curseEntry.count({ where: { status: 'APPROVED' } }),
      this.prisma.voiceRecording.count({ where: { reviewStatus: 'HUMAN_PASSED' } }),
      this.prisma.user.count(),
      this.prisma.curseEntry.groupBy({
        by: ['province'],
        where: { status: 'APPROVED' },
        _count: true,
      }),
    ]);

    const stats = { totalEntries, totalVoices, totalUsers, byProvince };
    await this.redis.set(cacheKey, JSON.stringify(stats), 3600);

    return stats;
  }
}