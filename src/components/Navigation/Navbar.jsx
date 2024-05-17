"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Navbar = ({ toggleSidebar, isCollapsed }) => {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        async function fetchUserName() {
            try {
                const userId = await getUserId();
                const userData = await getUserData(userId);
                setUserName(userData.name);
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        }
        fetchUserName();
    }, []);

    const handleLogout = () => {
        router.push('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !triggerRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <nav className={`bg-white fixed top-0 ${isCollapsed ? 'left-0' : 'left-64'} right-0 z-40 flex items-center justify-between p-4 h-16 transition-all duration-300`}>
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
            <div className="relative flex items-center space-x-4">
                <FontAwesomeIcon icon={faBell} className="text-gray-800 cursor-pointer text-xl pr-3" />
                <span
                    ref={triggerRef}
                    onClick={toggleDropdown}
                    className="text-gray-800 cursor-pointer flex items-center pr-3 border border-gray-300 rounded-md py-1 px-2 pl-4 hover:bg-gray-100"
                >
                    {userName}
                    <FontAwesomeIcon icon={faChevronDown} className="pl-10 ml-2" />
                </span>
                <div
                    ref={dropdownRef}
                    className={`absolute right-0 mt-40 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-300 ${
                        dropdownOpen ? 'opacity-100 max-h-60' : 'opacity-0 max-h-0'
                    }`}
                >
                    {/* add the settings */}
                    <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
                        <FontAwesomeIcon icon={faGear} className="mr-2" />
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
