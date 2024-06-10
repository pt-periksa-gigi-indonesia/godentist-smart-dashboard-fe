"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
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
import Notifications from '@/components/Utilities/Notifications'; // Import the Notifications component

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
        <nav className={`bg-white xl:fixed ${isCollapsed ? 'left-0 lg:px-10 sm:px-4' : 'lg:pl-16 xl:pl-8 xl:left-64 md:left-0 sm:left-0'} right-0 z-40 flex items-center justify-between p-4 h-16 transition-all duration-300`}>
            <div className="flex items-center space-x-4 mt-0">
                <button className={cn(`relative hidden lg:block`)} onClick={toggleSidebar}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <div className={cn("block lg:!hidden")}>
                    <MobileSidebar />
                </div>
            </div>
            <div className="relative flex items-center space-x-4 md:mr-6 mt-0 sm:mr-4">
                <Notifications />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative flex items-center space-x-2 h-8 rounded-lg border border-gray-300 p-2 py-5 pl-4 pr-12">
                            <Avatar className="h-7 w-7 ">
                                <AvatarImage src={userImage} alt={userName} />
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-gray-800 font-medium text-md">{userName}</span>
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
