import { getCookies } from '@/api/auth/cookiesHandler';

// get all clinic feedbacks from /feedbacks/clinic
export async function getClinicFeedbacks({ limit = 10, page = 1, id = '' , name = '', sortBy = ''} = {}) {
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const queryParams = new URLSearchParams({
        limit,
        page,
        ...(id && { id }),
        ...(name && { name }),
        ...(sortBy && { sortBy })

    }).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks/clinic?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}


// get doctor feedbacks from /feedbacks/doctor
export async function getDoctorFeedbacks({ limit = 10, page = 1, id = '', name = '', sortBy = 'createdAt:desc' } = {}) {
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const queryParams = new URLSearchParams({
        limit,
        page,
        ...(id && { id }),
        ...(name && { name }),
        ...(sortBy && { sortBy })
    }).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks/doctor?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch doctor feedbacks');
    }

    const data = await response.json();
    return data;
}


