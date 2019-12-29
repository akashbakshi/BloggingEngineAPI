import * as express from 'express';
import {Request,Response} from 'express';

import PostController from '../controllers/PostController'

const router = express.Router();

//Get all blog posts
router.get('/', (req:Request, res:Response)=>{
    PostController.GetAllPosts();
});

//get single blog post

router.get('/:id',(req:Request,res:Response)=>{

    let id = req.params.id;

    if(id != undefined){

        let post = PostController.GetSinglePostById(Number(id));

        res.status(200).send(post);
    }else{
        res.status(404).send("Please provide an id");
    }

});
//add blog post

//update blog post

//delete blog post




export default router;