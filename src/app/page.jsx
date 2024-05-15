"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

export default function DoctorDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  async function fetchUserInfo() {
    try {
      const user_id = await getUserId(); 
      const data = await getUserData(user_id); 
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user information:');
    }
  }

  async function authCheck() {
    const isValid = await checkToken();
    if (isValid) {
      fetchUserInfo();
    }
    else {
      router.push('/login');
    }
  }

  useEffect(() => {
    authCheck();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        
        {/* Dashboard Content */}
        <main className="flex-grow p-10 mt-16">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-800">Good Morning, Team!</h1>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity</h2>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Patients</h2>
            </div>
            <div className="col-span-2 p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Partner's Account</h2>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            </div>
            <div className="col-span-3 p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Total Transactions</button>
                <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-700">Popular Services</button>
                <button className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700">Feedbacks</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
