"use client";
import { useEffect, useState, useCallback } from 'react';
import { FaUserClock, FaUserCheck, FaUser } from 'react-icons/fa';

import { getDoctors } from '@/api/lib/doctorHandler';

import DoctorTable from '@/components/Tables/DoctorTable';
import { SkeletonDoctorTable } from '@/components/Tables/SkeletonDoctorTable';

import DoctorStats from '@/components/cards/DoctorStats';

import SeedButton from '@/components/seedButton';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalDoctor, setTotalDoctor] = useState(0);
    const [totalVerDoctor, setTotalVerifiedDoctor] = useState(0);
    const [totalUnverDoctor, setTotalUnverifiedDoctor] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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


    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
                    <SeedButton/>
                </div>

                {/* <DoctorStats
                    totalDoctors={totalDoctor}
                    totalVerifiedDoctors={totalVerDoctor}
                    totalUnverifiedDoctors={totalUnverDoctor}
                /> */}

                <div className="col-span-2 p-4  bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaUser className="text-xl ml-4 mr-4 text-gray-100" />
                            <div>
                                <h3 className="text-md font-normal">Total Doctor</h3>
                                <p className="text-xl font-bold">{totalDoctor  ? `${totalDoctor} doctors` : "-"} </p>
                            </div>
                        </div>

                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaUserClock className="text-xl ml-4 mr-4 text-gray-100" />
                            <div>
                                <h3 className="text-md font-normal">Unverified</h3>
                                <p className="text-xl font-bold">{totalUnverDoctor ? `${totalUnverDoctor} doctors` : "-"} </p>
                            </div>
                        </div>
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaUserCheck className="text-xl ml-4 mr-4 text-gray-100" />
                            <div>
                                <h3 className="text-md font-normal">Verified</h3>
                                <p className="text-xl font-bold">{totalVerDoctor ? `${totalVerDoctor} doctors` : "-"} </p>
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
        </>
    );
}
