import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        avatar: true,
        role: true,
        bio: true,
        isVip: true,
        points: true,
        createdAt: true,
        _count: {
          select: {
            entries: true,
            voices: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        avatar: true,
        bio: true,
      },
    });
  }

  async getContributions(userId: string) {
    const [entries, voices, comments] = await Promise.all([
      this.prisma.curseEntry.findMany({
        where: { submittedBy: userId, status: 'APPROVED' },
        select: {
          id: true,
          content: true,
          province: true,
          city: true,
          county: true,
          category: true,
          spicyLevel: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.voiceRecording.findMany({
        where: { userId },
        select: {
          id: true,
          durationSeconds: true,
          playCount: true,
          likeCount: true,
          createdAt: true,
          entry: {
            select: {
              id: true,
              content: true,
              province: true,
              city: true,
              county: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.comment.findMany({
        where: { userId },
        select: {
          id: true,
          content: true,
          type: true,
          createdAt: true,
          entry: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return { entries, voices, comments };
  }

  async getLeaderboard(limit = 50) {
    return this.prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        username: true,
        avatar: true,
        points: true,
        _count: {
          select: {
            entries: { where: { status: 'APPROVED' } },
            voices: true,
          },
        },
      },
      orderBy: { points: 'desc' },
      take: limit,
    });
  }
}