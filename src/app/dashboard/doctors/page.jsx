"use client";
import { useEffect, useState} from 'react';
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

    const [displayedDoctors, setDisplayedDoctors] = useState([]);
    const [filter, setFilter] = useState('All');
    const itemsPerPage = 8;

    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const data = await getDoctors({ limit: 100 });
            setDoctors(data.results);
            setTotalDoctor(data.results.length);
            const verifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "verified");
            setTotalVerifiedDoctor(verifiedDoctors.length);
            const unverifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "unverified");
            setTotalUnverifiedDoctor(unverifiedDoctors.length);

            setTotalPages(Math.ceil(data.results.length / itemsPerPage));
            setDisplayedDoctors(data.results.slice(0, itemsPerPage));
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
    }, []);


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        applyFilters(startIndex, endIndex);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        applyFilters(0, itemsPerPage, event.target.value.toLowerCase(), filter);
    };

    const applyFilters = (startIndex, endIndex, searchTerm = '', filter = 'All') => {
        let filteredDoctors = doctors;

        if (filter !== 'All') {
            filteredDoctors = filteredDoctors.filter(doctor => doctor.verificationStatus.toLowerCase() === filter.toLowerCase());
        }

        if (searchTerm) {
            filteredDoctors = filteredDoctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm) 
            );
        }

        setDisplayedDoctors(filteredDoctors.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredDoctors.length / itemsPerPage));
        setCurrentPage(1);
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
                        doctors={displayedDoctors}
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
