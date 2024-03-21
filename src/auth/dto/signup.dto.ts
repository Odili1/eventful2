import { IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    readonly firstname: string

    @IsNotEmpty()
    @IsString()
    readonly lastname: string

    @IsNotEmpty()
    @IsString()
    readonly username: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    readonly role: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string
}