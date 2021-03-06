import express, {Request, Response} from 'express';
import 'reflect-metadata';
import {useExpressServer, createExpressServer,Action} from 'routing-controllers';
import 'module-alias/register';
import * as bodyParser from 'body-parser';
import {createConnection, getConnection, ConnectionOptions} from 'typeorm';
import { User } from '@entity/User';
import * as jwt from 'jsonwebtoken';


if(process.env.JWTSECRET == undefined || process.env.JWTSECRET == null){
    console.log("No JWTSECRET environment variable provided\nExiting...");
    process.exit(1);
}

console.log(process.env.JWTSECRET);
let DB_HOST = process.env.DB_HOST;
let DB_USER = process.env.DB_USER;
let DB_PASS = process.env.DB_PASS;
let DB_NAME = process.env.DB_NAME;

let options:ConnectionOptions  = {
        type: "mysql",
        host: DB_HOST,
        port: 3306,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        entities: [__dirname+"/src/entity/*.js"],
        synchronize: false,
        logging: ["query", "error"]
}

if(options!){
    createConnection( options! ).then(async connection=>{
        console.log("Connected to Blog Engine Database");
    }).catch(err=>{
        console.log("error starting DB \n"+err);
    })
    
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

useExpressServer(app,{
    controllers: [__dirname+"/src/controllers/*.js"] // we specify controllers we want to use
    ,authorizationChecker: async (action: Action, roles: string[]) => {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        // demo code:
        const token = action.request.headers["x-auth-token"];
        if(token == null || token == undefined)
            return false;

        let secretKey = process.env.JWTSECRET;
        let decodedJWT:any = jwt.verify(token!,secretKey!); // verify the token with out secret

        let userToAuth:User;
        try{
            userToAuth= await getConnection().getRepository(User).findOneOrFail({username: decodedJWT.username}); // look up username from decoded token username
        }catch(err){
            return false; // if we can't find a user or it fails then fail
        }
        if(decodedJWT.email == userToAuth.email) // additional validation to make sure the email from the retrieved database user matches the token's email
            return true;
        else 
            return false; // if we get here the email and username was spoofed so fail
    }
});

const port = 3003;

app.listen(port,()=>{
    console.log("blogging engine starting on port "+port);
});

