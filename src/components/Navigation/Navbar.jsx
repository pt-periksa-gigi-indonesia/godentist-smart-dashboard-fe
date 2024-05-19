"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
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

const Navbar = () => {
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
        <nav className="bg-white fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 h-16">
            <div className="flex items-center space-x-4">
                {/* Toggle button */}
            </div>
            <div className="relative flex items-center space-x-4 mr-4">
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
