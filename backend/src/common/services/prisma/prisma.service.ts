import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    let isConnected = false;
    let retries = 0;

    while (!isConnected && retries < 5) {
      try {
        await this.$connect();
        isConnected = true;
        this.logger.log('✅ Database connected successfully');
      } catch (error) {
        this.logger.log(
          `Database Connection Error: Retrying:${retries} ......`,
        );
        retries++;
      }
    }

    if (!isConnected) {
      this.logger.error('❌ Failed to connect to database');
      throw new ServiceUnavailableException(
        'Database connection not available',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Database disconnected');
  }
}
