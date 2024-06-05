import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/api/auth/cookiesHandler';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Sidebar = ({ isCollapsed }) => {
    const [user_role, setRole] = useState('');
    const path = usePathname();

    useEffect(() => {
        getUserRole().then(user_role => {
            setRole(user_role);
        });
    }, []);

    return (
        <nav className={cn(`relative hidden pt-16 lg:block ${isCollapsed ? 'w-0' : 'w-64'} h-full top-0 `)}>
            <aside className={`fixed shadow-inner flex flex-col h-full ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'} z-50 top-0 left-0 bg-gradient-to-b from-blue-600 to-blue-700`}>
                <div className="bg-white rounded-xl mx-7 mt-6 p-2 flex justify-center items-center shadow-md">
                    <img
                        src="/static/images/godentist_logo.jpeg"
                        alt="GoDentist Logo"
                        className="h-13 w-auto"
                    />
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <Link href="/dashboard" className={cn("block p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard" ? "text-white font-bold" : "text-white font-medium")}>Dashboard</Link>
                    {user_role === 'master' && (
                        <Link href="/dashboard/admin" className={cn("block p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/admin" ? "text-white font-bold" : "text-white font-medium")}>Users</Link>
                    )}
                    <Link href="/dashboard/doctors" className={cn("block p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/doctors" ? "text-white font-bold" : "text-white font-medium")}>Doctors</Link>
                    <Link href="/dashboard/clinics" className={cn("block p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/clinics" ? "text-white font-bold" : "text-white font-medium")}>Clinics</Link>
                    <Link href="/dashboard/feedbacks" className={cn("block p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/feedbacks" ? "text-white font-bold" : "text-white font-medium")}>Feedbacks</Link>
                </nav>
            </aside>
        </nav>
    );
};

export default Sidebar;
