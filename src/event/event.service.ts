import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import * as qrcode from 'qrcode'
// import {v4 as uuid} from 'uuid'

import { Event } from './interfaces/event.interface';
import  mongoose, { Model } from 'mongoose';
import { Payload } from './interfaces/payload.interface';
import { AttendeeDto } from './dto/attendee.dto';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class EventService {
    constructor(
        @InjectModel('Event') private eventModel: Model<Event>,
    ){}

    // Creates an event
    async createEvent(event: Event, user: User): Promise<Event>{
        try {
            const newEvent = {
                id: new mongoose.Types.ObjectId().toHexString(),
                ...event, 
                creator: user
            }
            const res = await this.eventModel.create(newEvent)
            console.log(`newEvent: ${JSON.stringify(newEvent)}`);
            
            if (!res){
                throw new HttpException({
                    statusCode: HttpStatus.FORBIDDEN,
                    error: 'A problem occured while creating an Event'
                }, HttpStatus.FORBIDDEN) 
            }

            return res
        } catch (error) {
            console.log(error);
            
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    // Gets all events
    async getEvents(): Promise<Event[]>{
        try {
            // Get events from database
            console.log(`getEvents3`);
            const events = await this.eventModel.find()
            console.log(`getEvents4`);

            if (events.length == 0){
                throw new NotFoundException('Not Events found')
            }
            
            return events
        } catch (error) {
            console.log(error);
            
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    // Get event by Id
    async getEvent(eventId: string): Promise<any>{
        try {
            // Fetch event from database
            const event = await this.eventModel.find({_id: eventId})

            if (!event){
                throw new NotFoundException('Event not found')
            }

            console.log(`event: ${event}`);
            
            return event
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    // Gets events created by a creator
    async eventsCreated(creatorId: string): Promise<any>{
        try {
            // Get event by creators id
            console.log(`creatorId: ${creatorId}`);
            
            const events = await this.eventModel.find({'creator._id':  new mongoose.Types.ObjectId(creatorId)})
            console.log(events);
            

            if (events.length == 0){
                throw new NotFoundException('You have not created any event yet')
            }

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

    // Eventee should be able to aplly for events
    async applyForEvent(eventId: string, user: Payload, attendeeDto:AttendeeDto): Promise<AttendeeDto>{
        try {
            console.log(eventId);
            
            // Get event to apply for
            const event = await this.eventModel.findById(eventId)
            console.log(event);
            
            // Check is there's event
            if (!event){
                throw new NotFoundException('Event not found')
            }

            // Check if user has applied before
            const userApplied = event.attendees.find((userObj: User) => {
                return userObj.id == user.userId
            })

            console.log(`user applied: ${JSON.stringify(userApplied)}, userid: ${user.userId}`);
            

            if (userApplied){
                throw new HttpException({
                    statusCode: HttpStatus.FORBIDDEN,
                    error: 'This user has previously applied for this event'
                }, HttpStatus.FORBIDDEN) 
            }

            // set user reminder
            event.attendees = [...event.attendees, {
                firstname: attendeeDto.firstname,
                lastname: attendeeDto.lastname,
                email: user.email,
                eventeeReminder: attendeeDto.eventeeReminder
            }]
            
            console.log('Before save');
            event.save()

            return attendeeDto
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }


    // Verify scanned qrcode
    async verifyAttendee(eventId: string, userAsCreator: Payload, attendee: User): Promise<any>{
        try {
            // Get creator's id
            const creatorId = userAsCreator.userId

            // Fetch the event with the event id
            const event: any = await this.eventModel.findById(eventId)
            
            console.log(`verify user`);
            
            // Check if the event-creator's id is same as the current logged in creator
            const eventCreatorId = event.creator._id.toString()
            console.log(`Event: ${event}`);
            
            console.log(`EventcreatorId: ${eventCreatorId}`);
            const validEventTicket = eventCreatorId === creatorId
            console.log(validEventTicket);
            
            if (!validEventTicket){
                console.log(`forbidden 1`);
                
                throw new HttpException({
                    statusCode: HttpStatus.FORBIDDEN,
                    error: 'This is not a valid Event Ticket'
                }, HttpStatus.FORBIDDEN)
            }
            
            // check if attendee has previously registered
            const userApplied = event.attendees.find((userObj: User) => {
                return userObj.email == attendee.email
            })
            
            if (!userApplied){
                console.log(`forbidden 2`);
                throw new UnauthorizedException('You did not register for this event')
            }
            
            // Check if ticket has been previously scanned
            const scannedTicket = event.attendants.find((userObj: User) => {
                return userObj.email == attendee.email
            })

            if (scannedTicket){
                console.log(`forbidden 3`);
                throw new HttpException({
                    statusCode: HttpStatus.FORBIDDEN,
                    error: 'This Ticket have been verified'
                }, HttpStatus.FORBIDDEN)
            }

            // Add the attendee to the attendance array of the event
            event.attendants = [...event.attendants, {
                firstname: attendee.firstname,
                lastname: attendee.lastname,
                email: attendee.email
            }]

            return attendee
        } catch (error) {
            console.log({error});
            
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }



    // Dashboard
    // async ticketBought(){
    //     try {
    //         // Get events
    //         const events = this.eventModel.find


    //     } catch (error) {
    //         console.log({error});
            
    //         throw new HttpException({
    //             statusCode: HttpStatus.FORBIDDEN,
    //             error: error
    //         }, HttpStatus.INTERNAL_SERVER_ERROR, {
    //             cause: error
    //         })
    //     }
    // }

}
