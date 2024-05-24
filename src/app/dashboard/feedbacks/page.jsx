"use client";
import { useEffect, useState } from 'react';

import FeedbackTable from '@/components/Tables/FeedbackTable';
import { SkeletonFeedbackTable } from '@/components/Tables/SkeletonFeedbackTable';

import { getClinicFeedbacks, getDoctorFeedbacks } from '@/api/lib/feedbacksHandler';

import FeedbackStats from '@/components/cards/FeedbackStats';

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


                <FeedbackStats
                    totalFeedbacks={totalFeedbacks}
                    totalClinicFeedbacks={totalClinicFeedbacks}
                    totalDoctorFeedbacks={totalDoctorFeedbacks}
                />
 
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
