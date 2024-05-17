"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAngleRight, faAnglesRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FaUserClock, FaUserCheck, FaUser } from 'react-icons/fa';

import { getDoctors, getTotalVerifiedDoctors, getTotalUnverifiedDoctors, getTotalDoctors} from '@/api/lib/doctorHandler';


export default function DoctorsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');  // State to store the search term

    const router = useRouter();

    // Fetch the doctor data with pagination and search
    const fetchDoctors = async () => {
        try {
            const data = await getDoctors({ page: currentPage, name: searchTerm }); // Adjust getDoctors to accept an object with page and name
            setDoctors(data.results);
            setTotalPages(data.totalPages);
            setCurrentPage(1);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [currentPage, searchTerm]);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const dummyData = {
        unverifiedDoctors: 5,
        verifiedDoctors: 20,
        totalClinics: 10,
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

                        <div className="col-span-2 p-4 mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                                    <FaUserClock className="text-xl mr-4" />
                                    <div>
                                        <h3 className="text-md font-normal">Unverified</h3>
                                        <p className="text-xl font-bold">{dummyData.unverifiedDoctors} doctors</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                                    <FaUserCheck className="text-xl mr-4" />
                                    <div>
                                        <h3 className="text-md font-normal">Verified</h3>
                                        <p className="text-xl font-bold">{dummyData.verifiedDoctors} doctors</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                                    <FaUser className="text-xl mr-4" />
                                    <div>
                                        <h3 className="text-md font-normal">Total Doctor</h3>
                                        <p className="text-xl font-bold">{dummyData.totalClinics} clinics</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    <div className="flex  items-center mb-6 text-black">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-2 border-gray-200 rounded-lg p-2 w-2/4"
                        />
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
                        <span className="px-4 py-2 text-gray-800">Page {currentPage} of {totalPages}</span>

                        {/* Jump to first page */}
                        <button
                            className={`text-gray-800 cursor-pointer flex items-center border border-gray-300 rounded-md py-1 px-2 pl-4 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>

                        {/* Previous page */}
                        <button
                            className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>

                        {/* Next page */}
                        <button
                            className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>

                        {/* Jump to last page */}
                        <button
                            className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faAnglesRight} />
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}
