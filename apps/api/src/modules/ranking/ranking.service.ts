import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RankingService {
  private readonly RANKING_KEY = 'ranking:county';
  private readonly PROVINCE_RANKING_KEY = 'ranking:province';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getCountyRanking(page = 1, limit = 20, province?: string) {
    const cacheKey = `ranking:county:${province || 'all'}:${page}:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const where = province ? { province } : {};

    const items = await this.prisma.countyPower.findMany({
      where,
      orderBy: { rank: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.countyPower.count({ where });

    const result = {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }

  async getProvinceRanking() {
    const cacheKey = 'ranking:province:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const provinces = await this.prisma.countyPower.groupBy({
      by: ['province'],
      _sum: { powerValue: true, totalEntries: true, totalVoices: true },
      orderBy: { _sum: { powerValue: 'desc' } },
    });

    const result = provinces.map((p, index) => ({
      rank: index + 1,
      province: p.province,
      totalPower: p._sum.powerValue || 0,
      totalEntries: p._sum.totalEntries || 0,
      totalVoices: p._sum.totalVoices || 0,
    }));

    await this.redis.set(cacheKey, JSON.stringify(result), 600);
    return result;
  }

  async getCityRanking(city: string) {
    return this.prisma.countyPower.findMany({
      where: { city },
      orderBy: { rank: 'asc' },
    });
  }

  async getMyCountyRank(province: string, city: string, county: string) {
    const myCounty = await this.prisma.countyPower.findFirst({
      where: { province, city, county },
    });

    if (!myCounty) {
      return null;
    }

    const betterCount = await this.prisma.countyPower.count({
      where: {
        province,
        powerValue: { gt: myCounty.powerValue },
      },
    });

    return {
      ...myCounty,
      rankInProvince: betterCount + 1,
    };
  }

  async calculateAndUpdateRankings() {
    const counties = await this.prisma.countyPower.findMany();

    for (const county of counties) {
      const stats = await this.calculateCountyPower(county.province, county.city, county.county);
      await this.prisma.countyPower.update({
        where: { id: county.id },
        data: stats,
      });
    }

    const allCounties = await this.prisma.countyPower.findMany({
      orderBy: { powerValue: 'desc' },
    });

    for (let i = 0; i < allCounties.length; i++) {
      await this.prisma.countyPower.update({
        where: { id: allCounties[i].id },
        data: { rank: i + 1 },
      });

      await this.redis.zadd(this.RANKING_KEY, allCounties[i].powerValue, allCounties[i].id);
    }

    await this.invalidateRankingCache();
  }

  private async calculateCountyPower(province: string, city: string, county: string) {
    const entries = await this.prisma.curseEntry.count({
      where: { province, city, county, status: 'APPROVED' },
    });

    const voices = await this.prisma.voiceRecording.count({
      where: {
        entry: { province, city, county },
        reviewStatus: 'HUMAN_PASSED',
      },
    });

    const avgSpicy = await this.prisma.curseEntry.aggregate({
      where: { province, city, county, status: 'APPROVED' },
      _avg: { spicyLevel: true },
    });

    const spreadIndex = await this.prisma.curseEntry.aggregate({
      where: { province, city, county, status: 'APPROVED' },
      _sum: { playCount: true, likeCount: true },
    });

    const maxEntries = await this.prisma.curseEntry.count({ where: { status: 'APPROVED' } });
    const maxVoices = await this.prisma.voiceRecording.count({ where: { reviewStatus: 'HUMAN_PASSED' } });

    const entryRichness = maxEntries > 0 ? (entries / maxEntries) * 100 : 0;
    const voiceRatio = maxVoices > 0 ? (voices / maxVoices) * 100 : 0;
    const avgRating = avgSpicy._avg.spicyLevel || 0;
    const spread = (spreadIndex._sum.playCount || 0) + (spreadIndex._sum.likeCount || 0) * 10;

    const powerValue = entryRichness * 0.3 + voiceRatio * 0.25 + avgRating * 2.5 + spread * 0.01;

    return {
      totalEntries: entries,
      totalVoices: voices,
      avgSpicyLevel: avgRating,
      userRatings: avgRating,
      spreadIndex: spread,
      powerValue,
    };
  }

  private async invalidateRankingCache() {
    const keys = await this.redis.getClient().keys('ranking:*');
    for (const key of keys) {
      await this.redis.del(key);
    }
  }
}