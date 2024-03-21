import { Body, Controller, Get, Param, Post,  Request,  UnauthorizedException,  UseGuards, Res} from '@nestjs/common';

import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';
import { Event } from './interfaces/event.interface';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
import { UserService } from 'src/user/user.service';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { AttendeeDto } from './dto/attendee.dto';
import { Response } from 'express';

@Controller('event')
export class EventController {
    constructor(
        private eventService: EventService,
        private userService: UserService,
        private qrCodeService: QrCodeService
    ){}

    // Create Event
    // Protected Route: {Logged in users and Only Creators should be able to create}
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    // ==> Promise<Event>
    async createEvent(@Body() eventDto: EventDto, @Request() req:any): Promise<Event>{
        console.log(req.user);
        const {role} = req.user
        // Check if user is a creator
        if (role != 'event creator'){
            throw new UnauthorizedException('You are not logged in as a creator')
        }

        console.log(`new Event: ${JSON.stringify(eventDto)}`);
        
        // Get the creator's object
        const creator = await this.userService.getOneUser({email: req.user.email})
        
        const event = await this.eventService.createEvent(eventDto, creator)

        // Remember to redirect to /event/:eventId

        return event
    }

    // Creator should see events created
    @UseGuards(JwtAuthGuard)
    @Get('/eventsCreated')
    // ==> Promise<Event[]>
    async eventsCreated(@Request() req:any): Promise<any>{
        try {
            // Check if user is a creator
            const {userId, role} = req.user
            console.log(req.user);

            if (role != 'event creator'){
                throw new UnauthorizedException('You are not logged in as a creator')
            }

            const events = await this.eventService.eventsCreated(userId)

            return events
        } catch (error) {
            console.log(error.response.statusCode);
            return error
        }
    }


    // Eventee should be able to apply
    @UseGuards(JwtAuthGuard)
    @Post('/:eventId/ticket')
    async applyEvent(@Param('eventId') eventId: string, @Body() attendeeDto: AttendeeDto, @Request() req: any, @Res() res: Response){
        try {
            console.log('Applying');
            // Get user id as attendee
            const user = req.user
        
            console.log(`reqUser: ${JSON.stringify(req.user)}`);
            // Apply for the event
            const attendee = await this.eventService.applyForEvent(eventId, user, attendeeDto)
            
            console.log('Applying');

            return res.redirect(`/event/${eventId}/ticket/${user.userId}`)
        } catch (error) {
            return res.render('error', {
                data: {
                    user: req.user
                },
                message: error.message,
                error: error
            })
        }
    }



    @UseGuards(JwtAuthGuard)
    @Get('/:eventId/ticket/:attendeeId')
    // ==> Promise<any>
    async getTicket(@Param('eventId') eventId: string, @Request() req: any, @Body() attendeeDto: AttendeeDto, @Res() res: Response): Promise<any>{
        try {
            // console.log('Applying');
        
            // console.log(`reqUser: ${JSON.stringify(req.user)}`);
            // // Apply for the event
            // const attendee = await this.eventService.applyForEvent(eventId, req.user, attendeeDto)
            
            // console.log('Applying');
            
            
            // Generate sharable event link
            const currentUrl = (req.protocol + '://' + req.get('host') + req.originalUrl)
            const eventLink = currentUrl.slice(0, currentUrl.lastIndexOf('/ticket'))
            
            // Generate qrcode for validation
            const userDetails = JSON.stringify(`${req.originalUrl}/verified`)
            const qrCodeURL = await this.qrCodeService.generateQrCode(userDetails)
            
            console.log('Applied:');
            // return {attendee, qrCodeURL, eventLink}
            return res.render('ticket', {
                data: {
                    user: req.user, 
                    eventLink: eventLink, 
                    qrCode: qrCodeURL
                },
                message: null,
                error: null
            })
        } catch (error) {
            return res.render('error', {
                data: {
                    user: req.user
                },
                message: error.message,
                error: error
            })
        }
    }

    // Verify Ticket
    @UseGuards(JwtAuthGuard)
    @Get('/:eventId/ticket/:attendeeId/verified')
    // ==> Promise<any>
    async veriftyAttendee(@Param('attendeeId') attendeeId: string, @Param('eventId') eventId: string, @Request() req: any): Promise<any>{
        console.log(req.user);
        
        if (req.user.role != 'event creator'){
            throw new UnauthorizedException('You are not logged in as a creator')
        }
        console.log(`verify user, ${attendeeId}`);
        // Get the attendee details
        const attendee = await this.userService.getOneUser({_id: attendeeId})

        // Check if the attendee registered or bought the ticket
        const verifiedAttendee = await this.eventService.verifyAttendee(eventId, req.user, attendee)


        return {verifiedAttendee: verifiedAttendee}
    }


    @UseGuards(JwtAuthGuard)
    // User Dashboard for analytics
    @Get('user/dashboard/:userId')
    async getAnalytics(@Param('userId') creatorId: string, @Request() req: any, @Res() res: Response): Promise<any>{
        console.log(`user: ${JSON.stringify(req.user)}`);
        
        // Check if user role is a reator
        if (req.user.role === 'event creator' && req.user.userId === creatorId){
            // Get all events created by this creator
            const events = await this.eventService.eventsCreated(creatorId)

            // Arranged events in heirarchy of descending order based on tickect bought
            const eventsByBought = events.sort((a: Event, b: Event) => b.attendees.length - a.attendees.length)
            
            // Arranged events in heirarchy of descending order based on tickect scanned
            const eventsByScanned = events.sort((a: Event, b: Event) => b.attendants.length - a.attendants.length)

            console.log(eventsByBought);
            
            // return res.json({data: {
            //     events,
            //     eventsByBought,
            //     eventsByScanned
            // }})
            return res.render('dashboard', {
                data: {
                    events: events,
                    eventsByBought: eventsByBought,
                    eventsByScanned: eventsByScanned,
                    user: req.user
                },
                error: null,
                message: null
            })
        }

    }


// ----------------------------------------------------------------
    // UNPROTECTED ROUTES

    // Get all events
    @Get()
    // ==> Promise<Event[]>
    async getEvents(): Promise<Event[]>{
        const events = await this.eventService.getEvents()
        return events
    }


    // Get an event by Id
    @Get('/:eventId')
    // ==> Promise<any>
    async getEvent(@Param('eventId') eventId: string, @Request() req: any, @Res() res: Response): Promise<any>{
        const event = await this.eventService.getEvent(eventId)

        // const stringEvent = JSON.stringify(event)

        // console.log(`Event Page: ${event}`);
        // Generate sharable event link
        const eventLink = req.protocol + '://' + req.get('host') + req.originalUrl

        console.log(`Event Link: ${eventLink}`);
        // console.log(`Event Link: ${eventLink}`);
        // Get user details
        const user = JSON.stringify(res.locals.user) || null
        console.log(`Event user: ${user}`);
        

        if (!user) {
            return res.render('eventPage', {
                data: {
                    events: event,
                    eventLink: eventLink,
                    user: null
                },
                error: null,
                message: null
            })
        }
        // return {event, eventLink}
        return res.render('eventPage', {
            data: {
                events: event,
                eventLink: eventLink,
                user: user
            },
            error: false,
            message: null
        })
    }

}
