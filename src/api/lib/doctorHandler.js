"use server"
import { getCookies } from '@/api/auth/cookiesHandler';

// Get doctor data
export async function getDoctors({ limit = 10, page = 1 } = {}){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}

// Get doctor data by id

export async function getDoctorById(doctor_id){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctor_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}
