"use client";
import { useEffect, useState } from 'react';

import { FaComments, FaHospital, } from 'react-icons/fa';

import FeedbackTable from '@/components/Tables/FeedbackTable';
import { SkeletonFeedbackTable } from '@/components/Tables/SkeletonFeedbackTable';

import { getClinicFeedbacks, getDoctorFeedbacks } from '@/api/lib/feedbacksHandler';

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [totalClinicFeedbacks, setTotalClinicFeedbacks] = useState(0);
    const [totalDoctorFeedbacks, setTotalDoctorFeedbacks] = useState(0);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFeedbacks = async (searchTerm, page = 1 , sortType = 'ascending') => {
        setIsLoading(true);
        try {
            const clinicFeeds = await getClinicFeedbacks(searchTerm, page);
            const doctorFeeds = await getDoctorFeedbacks(searchTerm, page);
            const combinedFeeds = [
                ...clinicFeeds.results.map(feedback => ({ ...feedback, type: 'clinic' })),
                ...doctorFeeds.results.map(feedback => ({ ...feedback, type: 'doctor' }))
            ];
            

            setFeedbacks(combinedFeeds);
            setTotalFeedbacks(clinicFeeds.totalResults + doctorFeeds.totalResults);
            setTotalClinicFeedbacks(clinicFeeds.totalResults);
            setTotalDoctorFeedbacks(doctorFeeds.totalResults);

            const totalResults = clinicFeeds.totalResults + doctorFeeds.totalResults;
            const totalPages = Math.ceil(totalResults / itemsPerPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        } finally {
            setIsLoading(false);
        }
    
    };

    useEffect(() => {
        fetchFeedbacks(searchTerm, currentPage);
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => { 
        setSearchTerm(event.target.value);
    }


    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Feedbacks</h1>
                </div>

                <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaComments className="text-xl ml-4 mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Feedbacks</h3>
                                <p className="text-xl font-bold">{totalFeedbacks} feedbacks</p>
                            </div>
                        </div>
                        {/* there should be 2 more fore doctor clinic feedbacks */}
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaHospital className="text-xl ml-4 mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Clinic Feedbacks</h3>
                                <p className="text-xl font-bold">{totalClinicFeedbacks} feedbacks</p>
                            </div>
                        </div>

                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl flex items-center shadow">
                            <FaHospital className="text-xl ml-4 mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Doctor Feedbacks</h3>
                                <p className="text-xl font-bold">{totalClinicFeedbacks} feedbacks</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonFeedbackTable />
                ) : (
                    <FeedbackTable
                        feedbacks={feedbacks}
                        filter={filter}
                        searchTerm={searchTerm}
                        onFilterChange={setFilter}
                        onSearchChange={handleSearchChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

            </main>
        </>
    );
}
