import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RouteLogger } from '@middlewares/route.logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({}),
    PrismaModule,
    JwtModule.register({
      global: true,
      signOptions: {
        issuer: `${process.env.ISSUER}`,
        subject: `${process.env.ISSUER}`,
      },
      secret: `${process.env.JWT_SECRET}`,
    }),
    EventsModule,
    AuthModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(RouteLogger)
      .forRoutes('{*path}')
      .apply(AuthMiddleware)
      .forRoutes('auth/signin');
  }
}
