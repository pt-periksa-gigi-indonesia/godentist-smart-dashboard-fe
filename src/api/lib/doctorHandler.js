"use server"
import { getCookies } from '@/api/auth/cookiesHandler';

// Get doctor data
export async function getDoctors({ limit = 10, page = 1, name = '' } = {}){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const queryParams = new URLSearchParams({
        limit,
        page,
        ...(name && { name }),
    }).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors?${queryParams}`, {
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

// Change doctor verification status
export async function changeDoctorVerificationStatus(doctor_id, verificationStatus){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/verify/${doctor_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ verificationStatus })
    });

    const data = await response.json();

    return data;
}


export async function doctorsOcr(doctor_id){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/ocr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ doctorId: doctor_id }) 
    });

    // if (!response.ok) {
    //     throw new Error(response.statusText);
    // }

    const data = await response.json();

    return data;
}


// refresh ocr data
export async function doctorOcrLatest(doctor_id){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/ocr-card`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ doctorId: doctor_id }) 
    });

    // if (!response.ok) {
    //     throw new Error(response.statusText);
    // }

    const data = await response.json();

    return data;
}


// Edit OCR data
export async function editDoctorOcr(ocrData){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const bodyPayload = {
        doctorId: ocrData.doctorId,
        ...ocrData
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/edit-ocr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(bodyPayload)
    });

    // if response is not ok
    // if (!response.ok) {
    //     throw new Error(response.statusText);
    // }
    
    const data = await response.json();

    return data;
}