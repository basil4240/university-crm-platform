import { Module } from '@nestjs/common';
import { HashingService } from './services/hashing/hashing.service';
import { BcryptService } from './services/hashing/bcrypt/bcrypt.service';
import { StorageService } from './services/storage/storage.service';
import { LocalStorageService } from './services/storage/local-storage/local-storage.service';
import { HelperService } from './services/helper/helper.service';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  providers: [
    HashingService,
    BcryptService,
    StorageService,
    LocalStorageService,
    HelperService,
    PrismaService,
  ],
})
export class CommonModule {}
