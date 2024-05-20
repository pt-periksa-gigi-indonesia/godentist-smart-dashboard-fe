"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBell, faGear, faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCookies } from '@/api/auth/cookiesHandler';
import MobileSidebar from '../mobile-sidebar';
import { cn } from '@/lib/utils';


const Navbar = ({ toggleSidebar, isCollapsed }) => {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userId = await getUserId();
                const userData = await getUserData(userId);
                setUserName(userData.name);
                setUserImage(userData.image);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, []);

    const handleLogout = () => {
        deleteCookies();
        router.push('/login');
    };


    return (
        <nav className={`bg-white fixed ${isCollapsed ? 'left-0 lg:px-10 sm:px-4' : 'lg:left-64 md:left-0 sm:left-0'}  right-0 z-40 flex items-center justify-between p-4 h-16 transition-all duration-300`}>
            <div className="flex items-center space-x-4">
                <button className={cn(`relative hidden lg:block`)} onClick={toggleSidebar}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <div className={cn("block lg:!hidden")}>
                    <MobileSidebar />
                </div>
            </div>
            <div className="relative flex items-center space-x-4 lg:mr-0 sm:mr-4">
                <FontAwesomeIcon icon={faBell} className="text-gray-800 cursor-pointer text-xl pr-3" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={userImage} alt={userName} />
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end" forceMount>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <FontAwesomeIcon icon={faGear} className="mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default Navbar;
