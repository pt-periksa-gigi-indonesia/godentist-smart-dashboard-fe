// make the layout component
"use client";
import React from 'react';
import { useState } from 'react';

import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';

import SeedButton from '@/components/seedButton';

export default function DashboardLayout({ children }) {
    const [isCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isCollapsed);
        console.log(isCollapsed);
    };

    return (
        <div className='flex flex-row min-h-screen'>
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-grow flex flex-col h-screen w-full">
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                <main className={`flex-grow w-full pt-6 ${isCollapsed ? 'px-4' : 'pr-4 lg:pl-12 sm:pl-3'}`}>
                    
                    
                    {children}
                
                </main>
            </div>
        </div>
    )


}