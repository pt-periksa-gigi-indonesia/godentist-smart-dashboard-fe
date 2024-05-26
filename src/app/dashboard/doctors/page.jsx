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
            setDoctors([]);
            console.error('Failed to fetch doctors:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [currentPage, searchTerm, totalVerDoctor, totalUnverDoctor]);


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

                <DoctorStats
                    totalDoctor={totalDoctor}
                    totalVerDoctor={totalVerDoctor}
                    totalUnverDoctor={totalUnverDoctor}
                />

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
                        refreshDoctors={fetchDoctors}
                    />
                )}

            </main>
        </>
    );
}
