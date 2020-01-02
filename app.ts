import express, {Request, Response} from 'express';
import 'reflect-metadata';
import {useExpressServer, createExpressServer} from 'routing-controllers';
import 'module-alias/register';
import * as bodyParser from 'body-parser';
import {createConnection, getConnection, ConnectionOptions} from 'typeorm';

import { BlogPost } from "@entity/BlogPost";

console.log(process.env.NODE_ENV);
let options:ConnectionOptions;

if(process.env.NODE_ENV == "DevWin"){
    options = {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "app",
        database: "BlogEngine",
        entities: [__dirname+"/src/entity/*.js"],
        synchronize: false,
        logging: ["query", "error"]
    }
}else if(process.env.NODE_ENV == "DevMac"){
    options={
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "Eagles227",
        database: "BlogEngine",
        entities: [__dirname+"/src/entity/*.js"],
        synchronize: false,
        logging: ["query", "error"]
    }
}else{

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
});

const port = 3003;

app.listen(port,()=>{
    console.log("blogging engine starting on port "+port);
});

