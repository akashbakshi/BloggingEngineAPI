import {Entity,PrimaryGeneratedColumn,Column, BeforeInsert} from 'typeorm'

@Entity()
export class Post{

    constructor(title:string,content:string,author:string){
        this.author = author;
        this.title = title;
        this.content = content;
    }

    @PrimaryGeneratedColumn()
    id: number | undefined; // autogenerated primary key id of the post

    @Column()
    title:string; // The title of the post

    @Column()
    content:string; // the HTML markup content of the blog post


    @Column()
    author:string; // store the username of the author

    @Column()
    postedAt:Date = new Date();

    

}