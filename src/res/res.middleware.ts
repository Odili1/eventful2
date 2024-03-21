import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class ResMiddleware implements NestMiddleware {
  constructor(){}
  use(req: Request, res: Response, next: NextFunction) {
  try {
    if(
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
  ){
console.log('cookies');

    const token = req.cookies.user_token;
    
    if (!token) {
      res.cookie('error', "Login or Signup to perform action")
      res.redirect('/logout')
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log(`Decodedtoken: ${JSON.stringify(decodedToken)}`);
    if (!decodedToken) {
        res.cookie('error', "Login or Signup to perform action")
        res.redirect('/logout')
    }
    
    res.locals.user = decodedToken;
    // res.cookie('user', decodedToken.email)
    
    next()
    }else{
      next()
    }
    
} catch (error) {
  console.log(error);
  
    // res.cookie('error', "Login or Signup to perform action");
    res.redirect('/logout')
}

  }
}
