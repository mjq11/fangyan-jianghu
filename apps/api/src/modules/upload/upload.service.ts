import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client | null = null;
  private readonly bucket: string;
  private readonly region: string;
  private readonly useOSS: boolean;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    this.useOSS = configService.get('OSS_ENABLED', 'false') === 'true';

    if (this.useOSS) {
      this.s3Client = new S3Client({
        region: configService.get('OSS_REGION', 'oss-cn-hangzhou'),
        credentials: {
          accessKeyId: configService.get('OSS_ACCESS_KEY_ID', ''),
          secretAccessKey: configService.get('OSS_ACCESS_KEY_SECRET', ''),
        },
        endpoint: configService.get('OSS_ENDPOINT'),
        forcePathStyle: true,
      });
      this.bucket = configService.get('OSS_BUCKET', '');
      this.region = configService.get('OSS_REGION', 'oss-cn-hangzhou');
    } else {
      this.bucket = '';
      this.region = '';
    }
  }

  async getUploadUrl(
    fileName: string,
    mimeType: string,
    userId?: string,
  ): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
    const ext = fileName.split('.').pop() || 'mp3';
    const fileKey = `voices/${new Date().toISOString().split('T')[0]}/${uuidv4()}.${ext}`;

    if (!this.s3Client) {
      const mockUploadUrl = `/api/upload/mock?key=${encodeURIComponent(fileKey)}`;
      return {
        uploadUrl: mockUploadUrl,
        fileKey,
        publicUrl: mockUploadUrl,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: mimeType,
      Metadata: { userId: userId || '' },
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    const publicUrl = `https://${this.bucket}.${this.region}.aliyuncs.com/${fileKey}`;

    return { uploadUrl, fileKey, publicUrl };
  }

  async uploadFile(
    file: Buffer,
    fileKey: string,
    mimeType: string,
  ): Promise<string> {
    if (!this.s3Client) {
      this.logger.warn('S3 not configured, skipping upload');
      return `/uploads/${fileKey}`;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);
      return `https://${this.bucket}.${this.region}.aliyuncs.com/${fileKey}`;
    } catch (error) {
      this.logger.error('Upload failed', error);
      throw new BadRequestException('文件上传失败');
    }
  }

  validateAudioFile(mimeType: string, size: number): boolean {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm', 'audio/x-m4a'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException('不支持的音频格式');
    }

    if (size > maxSize) {
      throw new BadRequestException('文件大小不能超过 10MB');
    }

    return true;
  }

  generateFileHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }
}