"use server"
import {getCookies} from '@/api/auth/cookiesHandler';
import jwt from 'jsonwebtoken';

export async function checkToken() {
    const cookies = await getCookies();
    if(!cookies.access_token){
        return false;
    }
    
    const exp = jwt.decode(cookies.access_token.value).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if(exp < currentTime){
        return false;
    }
    return true;
}