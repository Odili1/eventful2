import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { eventSchema } from 'src/Schemas/event.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [UserModule, QrCodeModule, AuthModule, MongooseModule.forFeature([{name: 'Event', schema: eventSchema}])],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService]
})
export class EventModule {}
