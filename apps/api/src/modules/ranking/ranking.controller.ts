import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get('county')
  @ApiOperation({ summary: '县级战力榜' })
  @ApiQuery({ name: 'province', required: false })
  async getCountyRanking(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('province') province?: string,
  ) {
    return this.rankingService.getCountyRanking(page || 1, limit || 20, province);
  }

  @Get('province')
  @ApiOperation({ summary: '省级战力榜' })
  async getProvinceRanking() {
    return this.rankingService.getProvinceRanking();
  }

  @Get('city/:city')
  @ApiOperation({ summary: '市级战力榜' })
  async getCityRanking(@Param('city') city: string) {
    return this.rankingService.getCityRanking(city);
  }

  @Get('me')
  @ApiOperation({ summary: '获取当前位置的排名' })
  async getMyRanking(
    @Query('province') province: string,
    @Query('city') city: string,
    @Query('county') county: string,
  ) {
    return this.rankingService.getMyCountyRank(province, city, county);
  }

  @Get('contributors')
  @ApiOperation({ summary: '贡献者排行榜' })
  async getContributorsRanking() {
    return this.rankingService.getCountyRanking();
  }
}