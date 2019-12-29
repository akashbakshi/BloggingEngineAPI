
import {Post} from '../entity/Post';
import * as express from 'express';
import {Request,Response} from 'express';
import { Repository,getConnection,getRepository } from 'typeorm';

class PostController {

    private postRepo:Repository<Post>;
    constructor(){
        this.postRepo = getConnection().getRepository(Post);
    }

    async GetSinglePostById(id:number){
        let post;
        try{ 
        }catch(err){
            console.log("Error saving post becauwwdfddse: "+err);
            return {status:500,payload:"Could not save post"};
        }
        return {status:200,payload:"Post Saved"};
    }

    async GetAllPosts(){  

        let allPosts;
        try{
            allPosts  = this.postRepo.find();
        }catch(err){
            return {status:500,payload:"Could not retrieve all posts because \n"+err};
        }

        return {status:200,payload:allPosts};
    }

    async UpdatePost(id:number,updatedPost:Post){
        let currentPost;

        try{
            currentPost  = await this.postRepo.findOneOrFail({id:id});
            this.postRepo.remove(currentPost)
        }catch(err){
            return {status:500,payload:"Could not update post because retrieval failed \n"+err};
        }

        //now that we have the post in the database we need to see what's changed and update the respective properties

        if(updatedPost.title.toString().length > 0 && updatedPost.title != currentPost.title)
            currentPost.title = updatedPost.title;

            
        if(updatedPost.content.toString().length > 0 && updatedPost.content != currentPost.content)
            currentPost.content = updatedPost.content;

        if(updatedPost.author.toString().length > 0 && updatedPost.author != currentPost.author)
            currentPost.author = updatedPost.author;

        if(updatedPost.postedAt.toString().length > 0 && updatedPost.postedAt != currentPost.postedAt)
            currentPost.postedAt = updatedPost.postedAt;

        try{
            this.postRepo.save(currentPost);
        }catch(err){
            return {status:500,payload:"Could not save updated post because \n"+err};
        }

    }

    async DeletePost(id:number){

        let post;
        try{
            post  = await this.postRepo.findOneOrFail({id:id});
            this.postRepo.remove(post)
        }catch(err){
            return {status:500,payload:"Could not delete posts because \n"+err};
        }

        return {status:200,payload:"deleted post with ID "+id};
    }

}

export default new PostController();