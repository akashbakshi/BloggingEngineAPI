import { Repository, getConnection} from 'typeorm';
import {Request,Response} from 'express';
import { Get,Post,Authorized, Body, Put,Delete,Req,Res,Controller, Param } from 'routing-controllers';
import { User } from '@entity/User';
import {SignToken} from '@tools/TokenHandler';
import * as jwt from 'jsonwebtoken';

@Controller("/api/users")
export class UserController{

    private userRepo:Repository<User>;
    constructor(){
        this.userRepo = getConnection().getRepository(User); // get our user repository 
        
    }

    //get user credentials 
    @Get("/:username")
    @Authorized()
    async getByUsername(@Param("username") username:string,@Res() res:Response){
        try{
            let userToFind = await this.userRepo.findOneOrFail({username:username}); // attempt to find a user and if it doesn't exist fail so we can notify the requestor that it doesn't exist
            return res.status(200).send(userToFind);
        }catch(err){
            return res.status(404).send("Cannot find user with username: "+username);
        }
    }

    //Method that allows us to create or register a new user
    @Post("/")
    async addUser(@Body() user:User,@Res() res:Response){
        if(user.username == undefined || user.password == undefined || user.email == undefined || user.firstName == undefined || user.lastName == undefined) // if we're missing one of these fields throw an error 
            return res.status(400).send("Cannot add user because one of these are missing (username,password,first name, last name, e-mail)"); 

        if(await this.userRepo.findOne({username:user.username}) != null) // make sure user doesn't already exists as username is unique
            return res.status(400).send("A user with the username "+user.username+" already exists");
        
        if(await this.userRepo.findOne({email:user.email}) != null) // make sure user doesn't exists with this email because it is unique
            return res.status(400).send("A user with the email "+user.email+" already exists");

        try{
            await this.userRepo.save(user); // if we have none of the errors above save the user
            return res.status(201).send(user);
        }catch(err){
            return res.status(500).send("Cannot add user because \n"+err); 
        }
    }

    //Method that will allow the user to send login credentials to authenticate 
    @Post('/authenticate')
    async authenticateUser(@Req() req:Request, @Res() res:Response){
        if(req.body.username == undefined || req.body.password == undefined)
            return res.status(400).send("Please provide a username and password");
        
        let userToAuth;
        try{
            userToAuth = await this.userRepo.findOneOrFail({username:req.body.username});
        }catch(err){
            return res.status(400).send("Username/Password doesn't match"); // if there's no user with the username don't specify that for security reason, instead let them know the combination failed
        }

        if(userToAuth.verifyPassword(req.body.password)){
    
            let token = SignToken(userToAuth);
            return res.status(200).send(token); // return OK with either true or false depending on if the credentials match
        }else{
            return res.status(400).send("Username/Password doesn't match");
        }

      
    }
    @Post('/verify')
    async verifyToken(@Req() req:Request,@Res() res:Response){
        const token = req.header("x-auth-token");
        let username = req.body.username;
        let email = req.body.email;


        let decodedJWT:any;
        try{
            let secretKey = process.env.JWTSECRET;
            decodedJWT = jwt.verify(token!,secretKey!); // verify the token with out secret
        }catch(err){
            console.log("verification error\n"+err);
            return res.status(500).send(err);
        }

        if(decodedJWT.username == username && decodedJWT.email == email)
            return res.status(200).send("Valid Token");
        else
            return res.status(400).send("Invalid Token");
    }
}