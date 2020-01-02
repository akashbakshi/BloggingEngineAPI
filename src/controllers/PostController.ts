
import {BlogPost} from '../entity/BlogPost';
import {Request,Response} from 'express';
import {Controller, Param, Body, Get, Post, Put, Delete, Req, Res} from "routing-controllers";
import { Repository,getConnection,getRepository } from 'typeorm';

@Controller("/api/posts")
export class PostController {

    private postRepo:Repository<BlogPost>;
    constructor(){
        this.postRepo = getConnection().getRepository(BlogPost);
    }



    @Get('/:id')
    async GetSinglePostById( @Param("id") id:number,@Res() res:Response, @Req() req:Request){
        let post;
        try{ 
            post = await this.postRepo.findOneOrFail({id:id});
        }catch(err){
            console.log("Error get Single post because: "+err);
            return res.status(404).send("Cannot find post with id: "+id);
        }
        return res.status(200).send(post) 
    }

 

    @Get('/')
    async GetAllPosts(@Req() req:Request, @Res() res:Response){  
       
        let allPosts;
        try{
            allPosts  = await this.postRepo.find();
        }catch(err){
            return res.status(500).send("Could not retrieve all posts because \n"+err);
        }

        return  res.status(200).send(allPosts);
    }

    @Post('/')
    async SavePosts(@Body() postToSave:BlogPost,@Req() req:Request, @Res() res:Response){
        if(postToSave.author == undefined && postToSave.content == undefined && postToSave.title == undefined)
            res.status(400).send("Unable to save post because either title, content or author was missing");
        else{
            try{
                await this.postRepo.save(postToSave);
                return res.status(201).send(postToSave);
            }catch(err){
                return res.status(500).send("Error could not save Blog Post because: \n"+err);
            }
        }
    }

    @Put("/:id")
    async UpdatePost(@Param("id") id:number,@Res() res:Response ,@Body() updatedPost:BlogPost){
        let currentPost;

        try{
            currentPost  = await this.postRepo.findOneOrFail({id:id});
          
        }catch(err){
            return res.status(500).send("Could not update post because retrieval failed \n"+err);
        }

        //now that we have the post in the database we need to see what's changed and update the respective properties
        console.log(updatedPost);
        if(updatedPost.title != undefined && updatedPost.title != currentPost.title)
            currentPost.title = updatedPost.title;

            
        if(updatedPost.content != undefined && updatedPost.content != currentPost.content)
            currentPost.content = updatedPost.content;

        if(updatedPost.author != undefined && updatedPost.author != currentPost.author)
            currentPost.author = updatedPost.author;

        try{
            await this.postRepo.save(currentPost);
            return res.status(200).send(currentPost);
        }catch(err){
            return res.status(500).send("Could not save post because \n"+err);
        }
    }

    @Delete("/:id")
    async DeletePost(@Param("id") id:number,@Res() res:Response){

        let post;
        try{
            post  = await this.postRepo.findOneOrFail({id:id});
            await this.postRepo.remove(post)
        }catch(err){
            return res.status(500).send("Could not delete posts because \n"+err);
        }

        return res.status(200).send("deleted post with ID "+id);
    }

}
