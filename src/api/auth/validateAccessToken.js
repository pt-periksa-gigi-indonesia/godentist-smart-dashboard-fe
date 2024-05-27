"use server"
import {getCookies,  getUserRole, getUserId, deleteCookies} from '@/api/auth/cookiesHandler';
import { getUserData } from '../lib/userHandler';
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

export async function validateUserRole() {
    try {
        const currentRole = await getUserRole();
        const userId = await getUserId();
        const userData = await getUserData(userId);
        const userRole = userData.role;

        if (currentRole !== userRole) {
            await deleteCookies();
        }
    } catch (error) {
        console.error("Error validating user role:", error);
    }
}
