
import { getCookies } from "../auth/cookiesHandler";

export async function getDashboardInfo(){
    const cookies = await getCookies();
    const access_token = cookies.access_token.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    const data = await response.json();

    return data;
}


