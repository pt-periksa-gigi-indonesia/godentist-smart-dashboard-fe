// make the layout component
"use client";
import React from 'react';
import { useState } from 'react';

import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';

export default function DashboardLayout({ children }) {

    return (
        <div className='flex min-h-screen'>
            <Sidebar/>     
            <div className="flex-grow flex flex-col h-screen">
               <Navbar  />
                <main className="flex-grow w-full pt-6">
                    {children}
                </main>
            </div>
        </div>
    )


}