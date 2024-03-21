import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventService } from './event/event.service';

@Injectable()
export class AppService {
  constructor (private eventService: EventService){}
  async getEvents(): Promise<any> {
    try {
      const events = await this.eventService.getEvents()
      console.log('get events2');

      return events
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error
    }, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
    })
    }
  }
}
