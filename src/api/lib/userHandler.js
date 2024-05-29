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

// Send verification email
export async function sendVerificationEmail() {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/send-verification-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }

}

// Verify user email
export async function verifyEmail(){
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw error;
    }
}

// Sending forgot password email to user
export async function forgotPassword(email){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        throw error;
    }
}

// Reset user password with token
export async function resetPassword(token, password){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

// Create a new user
export async function createUser(user) {
    const cookies = await getCookies();
    const access_token = cookies.access_token?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }

        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}