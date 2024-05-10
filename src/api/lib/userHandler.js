"use server"
import {getCookies} from '@/api/auth/cookiesHandler';

export async function getUserInfo(user_id) {
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    if (!access_token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch user information: ${response.statusText}`);
    }

    return data;
}


