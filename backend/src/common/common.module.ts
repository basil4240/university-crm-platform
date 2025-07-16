import { Module } from '@nestjs/common';
import { HashingService } from './services/hashing/hashing.service';
import { BcryptService } from './services/hashing/bcrypt/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StorageService } from './services/storage/storage.service';
import { LocalStorageService } from './services/storage/local-storage/local-storage.service';
import { HelperService } from './services/helper/helper.service';
import { PrismaService } from './services/prisma/prisma.service';
import { FileService } from './services/file/file.service';
import jwtConfig from './config/jwt.config';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: StorageService,
      useClass: LocalStorageService,
    },
    HelperService,
    PrismaService,
    JwtService,
    FileService,
     AccessTokenGuard,
  ],
  exports: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: StorageService,
      useClass: LocalStorageService,
    },
    HelperService,
    PrismaService,
    FileService,
     AccessTokenGuard,
    ConfigModule.forFeature(jwtConfig),
  ],
})
export class CommonModule {}
