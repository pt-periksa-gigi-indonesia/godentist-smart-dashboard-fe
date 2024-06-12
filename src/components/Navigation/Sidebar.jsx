import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/api/auth/cookiesHandler';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faUserMd, faHospital, faComment } from '@fortawesome/free-solid-svg-icons'


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
            <aside className={`fixed shadow-inner flex flex-col h-full ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'} z-50 top-0 left-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800`}>
                <div className="mx-4 mt-6 p-2 flex justify-center items-center">
                    <img
                        src="/static/images/godentist_logo.png"
                        alt="GoDentist Logo"
                        className="h-13 w-auto"
                    />
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <Link href="/dashboard" className={cn("flex items-center p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard" ? "text-white font-bold" : "text-white font-medium")}>
                        <FontAwesomeIcon icon={faTachometerAlt} className="mr-4 w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    {user_role === 'master' && (
                        <Link href="/dashboard/admin" className={cn("flex items-center p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/admin" ? "text-white font-bold" : "text-white font-medium")}>
                            <FontAwesomeIcon icon={faUsers} className="mr-4 w-5 h-5" />
                            <span>Users</span>
                        </Link>
                    )}
                    <Link href="/dashboard/doctors" className={cn("flex items-center p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/doctors" ? "text-white font-bold" : "text-white font-medium")}>
                        <FontAwesomeIcon icon={faUserMd} className="mr-4 w-5 h-5" />
                        <span>Doctors</span>
                    </Link>
                    <Link href="/dashboard/clinics" className={cn("flex items-center p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/clinics" ? "text-white font-bold" : "text-white font-medium")}>
                        <FontAwesomeIcon icon={faHospital} className="mr-4 w-5 h-5" />
                        <span>Clinics</span>
                    </Link>
                    <Link href="/dashboard/feedbacks" className={cn("flex items-center p-4 hover:bg-blue-700 hover:text-white rounded-lg", path === "/dashboard/feedbacks" ? "text-white font-bold" : "text-white font-medium")}>
                        <FontAwesomeIcon icon={faComment} className="mr-4 w-5 h-5" />
                        <span>Feedbacks</span>
                    </Link>
                </nav>

            </aside>
        </nav>
    );
};

export default Sidebar;
