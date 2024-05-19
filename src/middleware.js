import { NextResponse } from 'next/server';
import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserRole } from "@/api/auth/cookiesHandler";

export async function middleware(req) {
    const isTokenValid = await checkToken(req);

    const url = req.nextUrl.clone();
    url.pathname = '/login';

    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = '/dashboard';

    const waitingUrl = req.nextUrl.clone();
    waitingUrl.pathname = '/waiting';
    
    if (!isTokenValid && (req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname === '/admin')) {
        return NextResponse.redirect(url.toString());
    } 
    
    else if (isTokenValid && req.nextUrl.pathname === '/admin') {
        const role = await getUserRole(req);
        if (role !== 'master') {
            return NextResponse.redirect(homeUrl.toString());
        }
    }
    else if (isTokenValid && (req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname === '/settings')) {
        const role = await getUserRole(req);
        if (role === 'user') {
            return NextResponse.redirect(waitingUrl.toString());
        }
        else if (role === 'admin') {
            return NextResponse.redirect(homeUrl.toString());
        }
    }
    

    return NextResponse.next();
}

export const config = {
    matcher: [ '/dashboard/:path*','/admin', '/login', '/register', '/settings', '/waiting'], 
};
