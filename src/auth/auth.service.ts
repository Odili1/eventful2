import {HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'


import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/interfaces/user.interface';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService
    ){}

    async signUp(signUpDto: SignUpDto): Promise<{user: User, token: string}>{
        try {
            const {firstname, lastname, username, email, role, password} = signUpDto
        
            // Check if user with the email already exist
            const existingUser = await this.userService.getOneUser({email})

            if (existingUser){
                console.log(existingUser);
                
                throw new HttpException({
                    statusCode: HttpStatus.FORBIDDEN,
                    error: 'A user with this user name already exists'
                }, HttpStatus.FORBIDDEN)
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Create user on DB
            const user = await this.userService.createUser({
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                role: role,
                password: hashedPassword
            })
            console.log(user.id);
            
            // Generate Token
            const token: string = this.jwtService.sign({id: user.id, firstname: firstname, lastname: lastname, email: email, role: role})

            return { user, token }
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.FORBIDDEN,
                error: error
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }
    
    async login(loginDto: LoginDto): Promise<{user: User, token: string}>{
        try {
            const {email, password} = loginDto

            const user = await this.userService.getOneUser({email})

            
            
            if (!user){
                throw new UnauthorizedException('Invalid email or password')
            }
            
            const isvalidPassword = await bcrypt.compare(password, user.password)
            
            if (!isvalidPassword){
                throw new UnauthorizedException('Invalid email or password')
            }
            
            const token: string = this.jwtService.sign({id: user.id, email: email, role: user.role})
            
            console.log(`user again: ${user}`);
            return { user, token }
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
