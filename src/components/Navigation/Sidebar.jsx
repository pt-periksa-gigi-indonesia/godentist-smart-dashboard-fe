import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/api/auth/cookiesHandler';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

const Sidebar = ({isCollapsed}) => {
    const [user_role, setRole] = useState('');
    
    useEffect(() => {
        getUserRole().then(user_role => {
            setRole(user_role);
        });
    }, []);

    return (
        <nav className={cn(`relative hidden pt-16 lg:block ${isCollapsed ? 'w-0' : 'w-64'} h-full top-0 `)}> 
            <aside className={`fixed shadow-inner border flex flex-col h-full ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'} z-50 top-0 left-0`}>
                <div className="pt-7 px-7 flex justify-center">
                    <img
                        src="/static/images/godentist_logo.jpeg"
                        alt="GoDentist Logo"
                        className="h-auto w-auto"
                    />
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <Link href="/dashboard" className="block p-4 text-gray-800 font-medium hover:bg-blue-dentist hover:text-white rounded-lg">Dashboard</Link>
                    {/* if user role admin show admin page */}
                    {user_role === 'master' && (
                        <Link href="/dashboard/admin" className="block p-4 text-gray-800 font-medium hover:bg-blue-dentist hover:text-white rounded-lg">Users</Link>
                    )}
                    <Link href="/dashboard/doctors" className="block p-4 text-gray-800 font-medium hover:bg-blue-dentist  hover:text-white rounded-lg">Doctors</Link>
                    <Link href="/dashboard/clinics" className="block p-4 text-gray-800 font-medium hover:bg-blue-dentist hover:text-white rounded-lg">Clinics</Link>
                    <Link href="/dashboard/feedbacks" className="block p-4 text-gray-800 font-medium hover:bg-blue-dentist hover:text-white rounded-lg">Feedbacks</Link>
                </nav>
            </aside>
        </nav>
    );
};

export default Sidebar;
