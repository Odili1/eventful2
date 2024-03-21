import { MiddlewareConsumer, Module,  NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configDotenv } from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { QrCodeService } from './qr-code/qr-code.service';
import { QrCodeModule } from './qr-code/qr-code.module';
import { ResModule } from './res/res.module';
import { ResMiddleware } from './res/res.middleware';

configDotenv()

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGO_URI), UserModule, EventModule, QrCodeModule, AuthModule, ResModule],
  controllers: [AppController],
  providers: [AppService, QrCodeService],
  exports: [AppService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResMiddleware).exclude(
      // '/',
      '/signup',
      '/login',
      '/logout'
    ).forRoutes('*')
  }
}
