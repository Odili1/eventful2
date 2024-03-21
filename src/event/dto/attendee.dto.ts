import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";



export class AttendeeDto{
    @IsNotEmpty()
    @IsString()
    readonly firstname: string

    @IsNotEmpty()
    @IsString()
    readonly lastname: string
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsDate()
    readonly eventeeReminder: Date
}