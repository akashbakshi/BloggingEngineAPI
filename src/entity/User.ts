import {Entity, Column, Unique, PrimaryColumn, BeforeInsert, BeforeUpdate} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity("users")
@Unique(["username", "email"])
export class User{
    
    constructor(username:string,password:string,email:string,firstName:string,lastName:string){
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @PrimaryColumn()
    username: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(pass:string){ // this function hashes our plain text password 
        this.password =  await bcrypt.hash(this.password,12); // trigger this function before inserting it or updating it in the database
    }


    @Column()
    password:string;

    @Column()
    email:string;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    verifyPassword(rawPassword:string){
        return bcrypt.compareSync(rawPassword,this.password); // will let us know if the provided password matches the user's password
    }
}