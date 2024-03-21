import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
// import { User } from 'src/user/interfaces/user.interface';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}


    @Post('signup')
    async signUp(@Body() signUpDto:SignUpDto, @Res() res: Response): Promise<any>{
        const {user, token} = await this.authService.signUp(signUpDto)

        res.cookie('user_token', token)
        // return res.json({user, token}) 
        return res.redirect('/')
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any>{
        const {user, token} = await this.authService.login(loginDto) 
        
        res.cookie('user_token', token)
        console.log(`authController`);
        // return res.json({user, token})
        
        return res.redirect('/')
    }


    // @Get('logout')
    // async logout(@Req() req: Request, @Res() res: Response){
    //     res.clearCookie('user_token')
    //     res.redirect('/')
    // }
}
