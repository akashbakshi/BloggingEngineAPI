import express, {Request, Response} from 'express';
import 'module-alias/register';
import "reflect-metadata";
import * as bodyParser from 'body-parser';
import {createConnection, getConnection} from 'typeorm';


const app = express();
const port = 3003;

app.use(bodyParser.json());


import { Post } from "@entity/Post";
createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "BlogEngine",
    entities: [Post],
    synchronize: false,
    logging: ["query", "error"],
}).then(async connection=>{
    console.log("Connected to Blog Engine Database");
}).catch(err=>{
    console.log("error starting DB \n"+err);
})

console.log(getConnection().getRepository(Post));

import router from '@routes/blog'

app.use('/api/blog',router);

app.listen(port,()=>{
    console.log("blogging engine starting on port "+port);
});

