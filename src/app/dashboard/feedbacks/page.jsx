"use client";
import { useEffect, useState } from 'react';

import FeedbackTable from '@/components/Tables/FeedbackTable';
import { SkeletonFeedbackTable } from '@/components/Tables/SkeletonFeedbackTable';

import { getClinicFeedbacks, getDoctorFeedbacks } from '@/api/lib/feedbacksHandler';

import FeedbackStats from '@/components/cards/FeedbackStats';

import SeedButton from '@/components/seedButton';

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [totalClinicFeedbacks, setTotalClinicFeedbacks] = useState(0);
    const [totalDoctorFeedbacks, setTotalDoctorFeedbacks] = useState(0);
    const [filter, setFilter] = useState('doctor');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState("createdAt:asc");

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); 
        fetchFeedbacks(searchTerm, 1, newFilter); 
    };

    const handleSortChange = (order) => {
        const sortOrder = `createdAt:${order}`;
        setSortOrder(sortOrder);
        fetchFeedbacks(searchTerm, currentPage, filter, sortOrder);
    };
    
    const fetchFeedbacks = async (searchTerm, page = 1, filter = 'doctor', sort = sortOrder) => {
        setIsLoading(true);
        try {
            let feeds = [];
            let totalResults = 0;
            const options = {
                page: page,
                sortBy: sort,
                filter: filter
            };
    
            if (filter === 'clinic') {
                const clinicFeeds = await getClinicFeedbacks(searchTerm, options);
                feeds = clinicFeeds.results.map(feedback => ({ ...feedback, type: 'clinic' }));
                totalResults = clinicFeeds.totalResults;
            } else { 
                const doctorFeeds = await getDoctorFeedbacks(searchTerm, options);
                feeds = doctorFeeds.results.map(feedback => ({ ...feedback, type: 'doctor' }));
                totalResults = doctorFeeds.totalResults;
            }
    
            setFeedbacks(feeds);
            setTotalFeedbacks(totalResults);
            setTotalPages(Math.ceil(totalResults / 8));
        } catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTotalFeedbacks = async () => {
        try {
            const clinicFeeds = await getClinicFeedbacks();
            setTotalClinicFeedbacks(clinicFeeds.totalClinicFeedbacks);
            const doctorFeeds = await getDoctorFeedbacks();
            setTotalDoctorFeedbacks(doctorFeeds.totalDoctorFeedbacks);
            const totalFeedbacks = clinicFeeds.totalClinicFeedbacks + doctorFeeds.totalDoctorFeedbacks;
            setTotalFeedbacks(totalFeedbacks);
        }
        catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        }
    };

    useEffect(() => {
        fetchFeedbacks(searchTerm, currentPage, filter, sortOrder);
        getTotalFeedbacks();
    }, [searchTerm, currentPage, filter, sortOrder]);

    const handleSearchChange = (event) => { 
        setSearchTerm(event.target.value);
    }


    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Feedbacks</h1>
                    <SeedButton />
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
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onSortChange={handleSortChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

            </main>
        </>
    );
}
