import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { EventService } from 'src/event/event.service';
import {v4 as uuid} from 'uuid'



@Injectable()
export class UserService {
    constructor(@InjectModel('User') 
    private userModel: Model<User>
    ){}

  async createUser(newUser: User): Promise<User>{
    try {
        const userData = {
            id: new mongoose.Types.ObjectId().toHexString(),
            ...newUser
        }
        const user = await this.userModel.create(userData)

        if (!user){
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: 'A problem occured while creating a user'
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return user
    } catch (error) {
        throw new HttpException({
            statusCode: HttpStatus.FORBIDDEN,
            error: error
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error
        })
    }
  }

  async getOneUser(param: object): Promise<User>{
    try {
        console.log('getOneUser');
        
        const user = await this.userModel.findOne(param)
        console.log(`user: ${user}`);
        
        if (!user){
            return null
        }

        return user
    } catch (error) {
        throw new HttpException({
            statusCode: HttpStatus.FORBIDDEN,
            error: error
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error
        })
    }
  }
}
