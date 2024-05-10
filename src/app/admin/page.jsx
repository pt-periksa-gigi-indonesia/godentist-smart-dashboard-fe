"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserInfo, getAllUsers, deleteUser } from '@/api/lib/userHandler';
import Sidebar from "@/components/Navigation/Sidebar";

export default function Page() {
    const [userInfo, setUserInfo] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const router = useRouter();
    const itemsPerPage = 8;

    async function fetchUserInfo() {
        try {
            const user_id = await getUserId();
            const data = await getUserInfo(user_id);
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    }

    async function fetchAllUsers(page) {
        try {
            const { results, totalPages } = await getAllUsers({ limit: itemsPerPage, page });
            setAllUsers(results);
            setTotalPages(Math.ceil(totalPages));
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
        fetchAllUsers(currentPage);
    }, [currentPage]);

    async function handleDelete(userId) {
        try {
            const result = await deleteUser(userId);
            if (result) {
                fetchAllUsers(currentPage);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    function openDeleteModal(userId) {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    }

    function confirmDelete() {
        if (selectedUserId) {
            handleDelete(selectedUserId);
            closeModal();
        }
    }

    function closeModal() {
        setSelectedUserId(null);
        setIsModalOpen(false);
    }

    function handlePageChange(newPage) {
        setCurrentPage(newPage);
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col w-full p-6">
                <h1 className="text-2xl text-gray-700 font-bold">Admin Page</h1>

                <div className="my-2">
                    <h2 className="text-lg font-medium text-gray-700">Manage User Accounts</h2>
                </div>

                {allUsers.length > 0 && (
                    <div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* Add a header cell for the index */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 font-extrabold uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 font-extrabold uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 font-extrabold  uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 font-extrabold uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 font-extrabold uppercase text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {allUsers.map((user, index) => {
                                    // Calculate the global index based on the current page and items per page
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

                                    return (
                                        <tr key={user.id} className='text-black'>
                                            {/* Add an extra column for the index */}
                                            <td className="px-6 py-4 whitespace-nowrap">{globalIndex}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => openDeleteModal(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                className={`px-4 py-2 bg-red-500 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}>
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
                            <button
                                className={`px-4 py-2 bg-blue-dentist rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-dentist-dark'}`}
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 space-y-4 w-1/3">
                            <h3 className="text-lg font-semibold text-gray-800">Delete Confirmation</h3>
                            <p className='text-gray-700'>Are you sure you want to delete this user?</p>
                            <div className="flex justify-end space-x-4">
                                <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
