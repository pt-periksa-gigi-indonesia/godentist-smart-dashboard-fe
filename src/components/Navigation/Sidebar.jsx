"use client";

import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/api/auth/cookiesHandler';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Sidebar = ({ isCollapsed }) => {
    const router = useRouter();
    const [user_role, setRole] = useState('');
    
    useEffect(() => {
        getUserRole().then(user_role => {
            setRole(user_role);
        });
    }, []);

    return (
        <div className={`fixed top-0 left-0 h-full ${isCollapsed ? 'w-0' : 'w-64'} transition-width duration-300`}> {/* Added transition for collapsing */}
            <aside className={`bg-white shadow-lg flex flex-col h-full ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
                <div className="pt-7 px-7 flex justify-center">
                    <img
                        src="/static/images/godentist_logo.jpeg"
                        alt="GoDentist Logo"
                        className="h-auto w-auto"
                    />
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <Link href="/" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Dashboard</Link>
                    {/* if user role admin show admin page */}
                    {user_role === 'admin' && (
                        <Link href="/admin" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Admin</Link>
                    )}
                    <Link href="/appointments" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Activity</Link>
                    <Link href="/patients" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Patients</Link>
                    <Link href="/schedule" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Partner's Account</Link>
                    <Link href="/doctors" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Notifications</Link>
                    <Link href="/recipes" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Quick Links</Link>
                    <Link href="/settings" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Settings</Link>
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;
