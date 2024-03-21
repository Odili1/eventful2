import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.gaurds';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Get home page
  @Get()
  async indexPageRender(@Req() req: Request, @Res() res: Response): Promise<void> {
    // const user = req.cookies.user_token
    const user = res.locals.user
    const error = req.cookies.error
    console.log(`usertoken: ${JSON.stringify(user)}`)
    // console.log(`token: ${user}`);
    
    
    const events = await this.appService.getEvents();
    // console.log(`Events: ${JSON.stringify(events)}`);
    
    return res.render('index', {
      data: {
        events: events,
        user:  user || false
      }, 
      message: null, 
      error: error || false
    })
  }

  // Signup Page
  @Get('/signup')
  getSignupPage(@Res() res: Response, @Req() req: Request): void{
    console.log(req.cookies);
    
    return res.render('signup', {data: {
      events: null,
      user: false
    }, 
    message: null, 
    error: false
  })
  }

  // Login Page
  @Get('/login')
  getLoginPage(@Res() res:Response): void{
    return res.render('login', {
      data: {
        events: null,
        user: null
      }, 
      message: null, 
      error: null
    })
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response){
    res.clearCookie('user_token')
    res.clearCookie('error')
    res.redirect('/')
  }
  
  
  // Create Event Page
  @UseGuards(JwtAuthGuard)
  @Get('/create')
  createEventPage(@Res() res: Response): void{
    const user = res.locals.user

    return res.render('createEvent', {data: {
      events: null,
      user: user || false
    }, 
    message: null, 
    error: null
  })
  }

  // Invalid Route

}
