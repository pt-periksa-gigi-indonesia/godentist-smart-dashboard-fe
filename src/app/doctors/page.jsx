"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

import { getDoctors, getDoctorById } from '@/api/lib/doctorHandler';


export default function DoctorsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const router = useRouter();

    // Fetch the doctor data
    const fetchDoctors = () => {
        getDoctors().then(data => {
            setDoctors(data.results);
            setTotalPages(data.totalPages);
        });
    };

    // Fetch the doctor data
    useEffect(() => {
        fetchDoctors(currentPage);
    }, [currentPage]);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar isCollapsed={isCollapsed} />
            <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

                <main className="flex-grow p-6 mt-16">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">No.</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs text-gray-500 font-extrabold uppercase text-center tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctors.map((doctor, index) => (
                                <tr key={doctor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.verificationStatus}</td>
                                    {/* details page*/}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        <button
                                            className="px-4 py-2 text-black rounded"
                                            onClick={() => router.push(`/doctors/details/${doctor.id}`)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            className={`px-4 py-2 bg-red-500 rounded-md ${currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-red-600"
                                }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-800">Page {currentPage} of {totalPages}</span>
                        <button
                            className={`px-4 py-2 bg-blue-500 rounded-md ${currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-600"
                                }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}
