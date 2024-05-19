"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

import { FaUserClock, FaUserCheck, FaUser } from 'react-icons/fa';

import { getDoctors} from '@/api/lib/doctorHandler';

import DoctorTable from '@/components/Tables/DoctorTable';
import { SkeletonDoctorTable } from '@/components/Tables/SkeletonDoctorTable';

export default function DoctorsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');  
    const [totalDoctor, setTotalDoctor] = useState(0);
    const [totalVerDoctor, setTotalVerifiedDoctor] = useState(0);
    const [totalUnverDoctor, setTotalUnverifiedDoctor] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the doctor data with pagination and search
    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const data = await getDoctors({ page: currentPage, name: searchTerm });
            setDoctors(data.results);
            console.log(data.results);
            const verifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "verified");
            setTotalVerifiedDoctor(verifiedDoctors.length);
            const unverifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "unverified");
            setTotalUnverifiedDoctor(unverifiedDoctors.length);
            setTotalDoctor(data.results.length);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
        finally {
            setIsLoading(false);
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
                                <FaUser className="text-xl mr-4" />
                                <div>
                                    <h3 className="text-md font-normal">Total Doctor</h3>
                                    <p className="text-xl font-bold">{totalDoctor} doctors</p>
                                </div>
                            </div>

                            <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                                <FaUserClock className="text-xl mr-4" />
                                <div>
                                    <h3 className="text-md font-normal">Unverified</h3>
                                    <p className="text-xl font-bold">{totalUnverDoctor} doctors</p>
                                </div>
                            </div>
                            <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                                <FaUserCheck className="text-xl mr-4" />
                                <div>
                                    <h3 className="text-md font-normal">Verified</h3>
                                    <p className="text-xl font-bold">{totalVerDoctor} doctors</p>
                                </div>
                            </div>

                        </div>
                    </div>


                    {isLoading ? (
                        <SkeletonDoctorTable />
                    ) : (
                        <DoctorTable 
                            doctors={doctors} 
                            searchTerm={searchTerm} 
                            handleSearchChange={handleSearchChange}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            
                        />
                    )}

                </main>
            </div>
        </div>
    );
}
