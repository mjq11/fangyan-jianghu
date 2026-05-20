import { Module } from '@nestjs/common';
import { CurseController } from './curse.controller';
import { CurseService } from './curse.service';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [CurseController],
  providers: [CurseService],
  exports: [CurseService],
})
export class CurseModule {}