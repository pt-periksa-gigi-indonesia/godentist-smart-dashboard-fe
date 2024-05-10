"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';

import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserInfo, getAllUsers, deleteUser } from '@/api/lib/userHandler';

import Sidebar from "@/components/Navigation/Sidebar";

export default function Page() {
    const [userInfo, setUserInfo] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const router = useRouter();

    async function fetchUserInfo() {
        try {
            const user_id = await getUserId();
            const data = await getUserInfo(user_id);
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    }

    async function fetchAllUsers() {
        try {
            const users = await getAllUsers(); 
            setAllUsers(users.results);  
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    }
    

    async function foo() {
        const validate = await checkToken();
        if (!validate) {
            router.push('/login');
        }
    }

    useEffect(() => {
        foo();
        fetchUserInfo();
        if (userInfo && userInfo.role !== 'admin') {
            router.push('/');
        }
        fetchAllUsers();
    }, []);

    async function handleDelete(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const result = await deleteUser(userId);
                if (result) {
                    fetchAllUsers()
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <h1>Admin Page</h1>

            {allUsers.length > 0 && (
                <div>
                    <h2>All Users:</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Delete</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allUsers.map(user => (
                                <tr key={user.id} className='text-black'>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}

        </div>
    );
}
