import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurseService } from './curse.service';
import { CreateCurseDto, QueryCurseDto, LikeCurseDto } from './dto/curse.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('curse')
@Controller('curse')
export class CurseController {
  constructor(private curseService: CurseService) {}

  @Get()
  @ApiOperation({ summary: '获取骂语词条列表' })
  async findAll(@Query() query: QueryCurseDto) {
    return this.curseService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取统计数据' })
  async getStats() {
    return this.curseService.getStats();
  }

  @Get('random')
  @ApiOperation({ summary: '随机获取一条词条（随便看看）' })
  async getRandom() {
    return this.curseService.getRandom();
  }

  @Get('county')
  @ApiOperation({ summary: '按县市获取词条' })
  async findByCounty(
    @Query('province') province: string,
    @Query('city') city: string,
    @Query('county') county: string,
    @Query('category') category?: string,
  ) {
    return this.curseService.findByCounty(province, city, county, category);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取词条详情' })
  async findById(@Param('id') id: string, @Request() req?: { user?: { id: string } }) {
    return this.curseService.findById(id, req?.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交新词条' })
  async create(@Body() dto: CreateCurseDto, @Request() req: { user: { id: string } }) {
    return this.curseService.create(dto, req.user.id);
  }

  @Put(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞/取消点赞词条' })
  async like(@Param('id') id: string, @Body() dto: LikeCurseDto, @Request() req: { user: { id: string } }) {
    return this.curseService.like(id, req.user.id, dto);
  }
}