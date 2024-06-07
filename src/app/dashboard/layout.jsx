"use client";
import React from 'react';
import { useState } from 'react';

import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';
import { validateUserRole } from '@/api/auth/validateAccessToken';

export default function DashboardLayout({ children }) {
    const [isCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isCollapsed);
        console.log(isCollapsed);
    };

    React.useEffect(() => {
        validateUserRole();
    }, []);


    return (
        <div className='flex flex-row min-h-screen'>
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-grow flex flex-col h-screen w-full">
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                <main className={`flex-grow w-full pt-6 ${isCollapsed ? 'px-4' : 'lg:pr-4 lg:pl-12 sm:px-3'} bg-blue-dentist-light`}>
                    
                    
                    {children}
                
                </main>
            </div>
        </div>
    )


}