import { IsArray, IsDate, IsEmpty, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"; 
import { User } from "src/user/interfaces/user.interface";

export class EventDto{
    @IsString()
    @IsNotEmpty()
    readonly eventTitle: string

    @IsNotEmpty()
    @IsString()
    readonly eventDetails: string

    @IsNotEmpty()
    @IsString()
    readonly eventType: string

    @IsNotEmpty()
    @IsString()
    readonly industry: string

    @IsNotEmpty()
    @IsNumberString()
    readonly slots: string

    @IsNotEmpty()
    @IsString()
    readonly address: string

    @IsNotEmpty()
    @IsString()
    readonly city: string

    @IsNotEmpty()
    @IsString()
    readonly country: string

    @IsOptional()
    readonly tags: object

    @IsNotEmpty()
    @IsDate()
    readonly startDate: Date

    @IsNotEmpty()
    @IsDate()
    readonly endDate: Date

    @IsOptional()
    @IsArray()
    readonly attendees: object[]

    @IsEmpty({message: 'You cannot pass user id'})
    readonly creator: User
}