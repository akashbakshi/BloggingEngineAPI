
import * as jwt from 'jsonwebtoken';
import { User } from '@entity/User';

/*
* Function used to sign JWT tokens for users using their username and email
* Parameter: User 
*/
export function SignToken(userToAuth:User):string{
    let payload = {
        username:userToAuth.username, // get the username to embed in our payload
        email:userToAuth.email // get the email to embed in our payload
    }

    let secretKey = process.env.JWTSECRET;

    const token = jwt.sign(payload,secretKey!,{expiresIn:60*30}); // sign the token with our secret and set expiry for 30 mins (60 secs * 30 mins)
    return token; // return our generated token
}
