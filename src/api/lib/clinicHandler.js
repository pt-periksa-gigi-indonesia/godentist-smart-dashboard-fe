// get all clinics
import { getCookies } from "../auth/cookiesHandler";

export async function getClinics({ limit = 10, page = 1, name = '' } = {}){

    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const queryParams = new URLSearchParams({
        limit,
        page,
        ...(name && { name }),
    }).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clinics?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;

}

// get clinic data by id
export async function getClinicById(clinic_id){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clinics/${clinic_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}

// get clinic transactions
export async function getClinicTransactions(clinic_id){
    try {
        const cookies = await getCookies();
        const accessToken = cookies.access_token.value;

        const response = await fetch(`/clinics/${clinic_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }

        const data = await response.json();
        const totalAmountClinic = data.totalAmountClinic;
        return { totalAmountClinic };
    } catch (error) {
        console.error('Failed to fetch clinic transactions:', error);
        return { totalAmountClinic: 0 };
    }
}

// get all clinic total transactionss
