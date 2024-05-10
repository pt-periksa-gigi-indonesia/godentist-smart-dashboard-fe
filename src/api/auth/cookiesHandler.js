"use server"
import { cookies } from 'next/headers'

export async function setCookies(data) { 
    cookies().set('user_id', data.user.id, { path: '/' });
    cookies().set('access_token', data.tokens.access.token, { path: '/' });
    cookies().set('refresh_token', data.tokens.refresh.token, { path: '/' });
}

export async function deleteCookies() {
    cookies().delete('access_token');
    cookies().delete('refresh_token');
}

export async function getCookies() {
    const access_token = cookies().get('access_token');
    const refresh_token = cookies().get('refresh_token');
    return { access_token, refresh_token };
}

export async function getUserId() {
    const usersId = cookies().get('user_id'); 
    return usersId.value;
}