import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/Schemas/user.schema';
import { UserController } from './user.controller';
// import { EventModule } from 'src/event/event.module';


@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: userSchema}])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})


export class UserModule {}
