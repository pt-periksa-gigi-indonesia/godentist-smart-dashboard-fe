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


// get all users
export async function getAllUsers({ name,  role="user" ,limit = 10, page = 1 } = {}) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    if (!access_token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    const queryParams = new URLSearchParams({
        ...(name && { name }),
        ...(role && { role }),

        limit,
        page
    }).toString();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    throw new Error('Unauthorized: Invalid access token.');
                case 403:
                    throw new Error('Forbidden: You do not have access to this resource.');
                case 404:
                    throw new Error('Not Found: The requested resource was not found.');
                default:
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}


// Delete a user
export async function deleteUser(user_id) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    if (!access_token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    throw new Error('Unauthorized: Invalid access token.');
                case 403:
                    throw new Error('Forbidden: You do not have access to this resource.');
                case 404:
                    throw new Error('Not Found: The requested resource was not found.');
                default:
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}