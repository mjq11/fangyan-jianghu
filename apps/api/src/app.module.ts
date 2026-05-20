import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CurseModule } from './modules/curse/curse.module';
import { VoiceModule } from './modules/voice/voice.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { CommentModule } from './modules/comment/comment.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    CurseModule,
    VoiceModule,
    RankingModule,
    CommentModule,
    UploadModule,
  ],
})
export class AppModule {}