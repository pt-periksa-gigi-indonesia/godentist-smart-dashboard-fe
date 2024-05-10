"use client";

import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();

    async function handleLogout() {
        deleteCookies();
        router.push('/login');
    }

    return (
        <div>
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="pt-7 px-7 flex justify-center">
                    <img
                        src="/static/images/godentist_logo.jpeg"
                        alt="GoDentist Logo"
                        className="h-auto w-auto"
                    />
                </div>
                <nav className="flex-grow p-6 space-y-4">
                    <a href="/dashboard" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Dashboard</a>
                    <a href="/appointments" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Activity</a>
                    <a href="/patients" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Patients</a>
                    <a href="/schedule" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Partner's Account</a>
                    <a href="/doctors" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Notifications</a>
                    <a href="/recipes" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Quick Links</a>
                    <a href="/settings" className="block p-4 text-gray-800 hover:bg-blue-dentist hover:text-white rounded-lg">Settings</a>
                </nav>
                <button
                    onClick={handleLogout}
                    className="m-6 p-4 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
                >
                    Log out
                </button>
            </aside>
        </div>
    );
};
export default Sidebar;