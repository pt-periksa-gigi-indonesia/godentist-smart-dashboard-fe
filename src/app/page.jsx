"use client";
import { deleteCookies } from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { checkToken } from '@/api/auth/validateAccessToken';
import Image from "next/image";

export default function DoctorDashboard() {
  const router = useRouter();

  async function handleLogout() {
    deleteCookies();
    router.push('/login');
  }

  async function foo() {
    const validate = await checkToken();
    if (!validate) {
      router.push('/login');
    }
  }

  useEffect(() => {
    foo();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
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

      {/* Dashboard Content */}
      <main className="flex-grow p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Good Morning, Team!</h1>
          <input type="search" placeholder="Search" className="px-4 py-2 rounded-lg drop-shadow border-gray-300 text-gray-800" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> Patients</h2>
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
  );
}
