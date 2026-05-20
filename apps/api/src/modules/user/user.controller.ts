import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: { user: { id: string } },
  ) {
    if (req.user.id !== id) {
      throw new Error('无权限修改其他用户信息');
    }
    return this.userService.update(id, dto);
  }

  @Get(':id/contributions')
  @ApiOperation({ summary: '获取用户贡献' })
  async getContributions(@Param('id') id: string) {
    return this.userService.getContributions(id);
  }

  @Get('leaderboard/contributors')
  @ApiOperation({ summary: '贡献者排行榜' })
  async getLeaderboard() {
    return this.userService.getLeaderboard();
  }
}