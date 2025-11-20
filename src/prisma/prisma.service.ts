import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      errorFormat:
        `${process.env.NODE_ENV}` === 'development' ? 'pretty' : undefined,
    });
  }
  async onModuleInit() {
    this.logger.log('Connected to MySQL service database');
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from MySQL service database');
  }
  onApplicationShutdown(signal?: string) {
    this.logger.log(`Application shutdown gracefully with signal, ${signal}`);
  }
}
