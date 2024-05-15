"use server"
import { getCookies } from '@/api/auth/cookiesHandler';

// Get user data
export async function getUserData(user_id) {
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}

// Get all users
export async function getAllUsers({ name, role, limit = 10, page = 1 } = {}) {
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
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            ...data,
            results: data.results.filter(user => user.role !== "master") 
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Delete a user
export async function deleteUser(user_id) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Update a user information
export async function updateUser(user_id, updatedFields) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Update a user role
export async function updateUserRole(user_id, updatedFieldsRole) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify/${user_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(updatedFieldsRole),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}