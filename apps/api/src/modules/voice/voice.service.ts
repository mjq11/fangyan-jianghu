import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VoiceService {
  constructor(private prisma: PrismaService) {}

  async findByEntryId(entryId: string) {
    return this.prisma.voiceRecording.findMany({
      where: { entryId, reviewStatus: 'HUMAN_PASSED' },
      orderBy: { likeCount: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });
  }

  async findById(id: string) {
    const voice = await this.prisma.voiceRecording.findUnique({
      where: { id },
      include: {
        entry: { select: { id: true, content: true, province: true, city: true, county: true } },
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    if (!voice) {
      throw new NotFoundException('语音不存在');
    }

    await this.prisma.voiceRecording.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });

    return voice;
  }

  async create(data: {
    entryId: string;
    userId?: string;
    fileUrl: string;
    fileKey: string;
    durationSeconds?: number;
    mimeType?: string;
    transcript?: string;
  }) {
    return this.prisma.voiceRecording.create({
      data: {
        entryId: data.entryId,
        userId: data.userId,
        fileUrl: data.fileUrl,
        fileKey: data.fileKey,
        durationSeconds: data.durationSeconds,
        mimeType: data.mimeType,
        transcript: data.transcript,
        reviewStatus: 'PENDING',
      },
    });
  }

  async like(id: string, userId: string) {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, voiceId: id, type: 'voice' },
    });

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      await this.prisma.voiceRecording.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    }

    await this.prisma.like.create({
      data: { userId, voiceId: id, type: 'voice' },
    });
    await this.prisma.voiceRecording.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });

    return { liked: true };
  }
}