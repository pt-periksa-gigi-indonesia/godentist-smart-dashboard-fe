import { NextResponse } from 'next/server';
import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserRole } from "@/api/auth/cookiesHandler";

export async function middleware(req) {
    const isTokenValid = await checkToken(req);

    const url = req.nextUrl.clone();
    url.pathname = '/login';

    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = '/';

    const waitingUrl = req.nextUrl.clone();
    waitingUrl.pathname = '/waiting';

    if (!isTokenValid && (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/admin')) {
        return NextResponse.redirect(url.toString());
    } 
    else if (isTokenValid && req.nextUrl.pathname === '/admin') {
        const role = await getUserRole(req);
        if (role !== 'master') {
            return NextResponse.redirect(homeUrl.toString());
        }
    }
    else if (isTokenValid && (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/settings')) {
        const role = await getUserRole(req);
        if (role === 'user') {
            return NextResponse.redirect(waitingUrl.toString());
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin', '/login', '/register', '/settings', '/waiting'], 
};
