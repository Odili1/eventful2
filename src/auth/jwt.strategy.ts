// import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request, Response } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as jwt from 'jsonwebtoken'
import {config} from 'dotenv'

// import { User } from "./interfaces/auth.interface";
import { UserService } from "src/user/user.service";

config()


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJwt,
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    private static extractJwt(req: Request, res: Response): string | null{
        if(
            req.cookies &&
            'user_token' in req.cookies &&
            req.cookies.user_token.length > 0
        ){
            return req.cookies.user_token
        }

        return null
    }

    async validate(payload: any): Promise<any>{
        const {id, firstname, lastname, email, role} = payload
        console.log('jwt strategy');
        console.log(email);

        return {userId: id, firstname: firstname, lastname: lastname, email: email, role: role}
    }
}