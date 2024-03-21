import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
// import { EventService } from 'src/event/event.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        // private eventService: EventService
    ){}

    @Get('dashBoard/:userId')
    // Get data for analytics
    async getAnalytics(){
        
    }
}
