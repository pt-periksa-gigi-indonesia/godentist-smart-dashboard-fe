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
    const [sortOrder, setSortOrder] = useState("createdAt:desc");

    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFeedbacks = async (page = 1, filter = 'doctor', sort = sortOrder) => {
        setIsLoading(true);
        try {
            let feeds = [];
            let totalResults = 0;
            const options = {
                page: page,
                sortBy: sort,
                filter: filter,
                limit: 8,
            };

            if (filter === 'clinic') {
                const clinicFeeds = await getClinicFeedbacks(options);
                feeds = clinicFeeds.results.map(feedback => ({ ...feedback, type: 'clinic' }));
                totalResults = clinicFeeds.totalResults;
            } else {
                const doctorFeeds = await getDoctorFeedbacks(options);
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

    const [cachedResults, setCachedResults] = useState([]);

    const fetchFeedbackSearch = async (searchName, page) => {
        const [doctorResults, clinicResults] = await Promise.all([
            getDoctorFeedbacks({ name: searchName, limit: 100, page }),
            getClinicFeedbacks({ name: searchName, limit: 100, page })
        ]);

        return { doctorResults: doctorResults.results, clinicResults: clinicResults.results };
    };

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            try {
                const { doctorResults, clinicResults } = await fetchFeedbackSearch('', 1);
                const combinedResults = [...doctorResults, ...clinicResults];
                setCachedResults(combinedResults);
            } catch (error) {
                console.error('Failed to preload data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initialLoad();
    }, []);

    // Handle search input changes
    const handleSearch = async (event) => {
        const searchName = event.target.value;
         // Update search term immediately to ensure input responsiveness
        setSearchTerm(searchName);
        
        setCurrentPage(1);
        const normalizedTerm = searchName.toLowerCase();

        if (normalizedTerm === "") {
            setSearchResults([]);
            setIsSearching(false);
            setIsLoading(false);
            return;
        }

        if (!isLoading) {
            setIsLoading(true); // Only set loading if not already loading
        }

        try {
            let filteredResults = cachedResults.filter(feedback =>
                feedback.name.toLowerCase().includes(normalizedTerm)
            );

            if (filteredResults.length > 0) {
                setSearchResults(filteredResults);
                setIsSearching(true);
            } else {
                // When no results are found in the cache
                const { doctorResults, clinicResults } = await fetchFeedbackSearch(searchName, 1);
                const newResults = [...doctorResults, ...clinicResults];
                if (newResults.length === 0) {
                    console.log("No results found, even after fetching");
                }
                setCachedResults(prevResults => [...prevResults, ...newResults]); // Append new results to cache
                filteredResults = newResults.filter(feedback =>
                    feedback.name.toLowerCase().includes(normalizedTerm)
                );
                setSearchResults(filteredResults);
                setIsSearching(true);
            }
        } catch (error) {
            console.error('Failed to search:', error);
            setSearchResults([]); // Ensure results are cleared on error
            setIsSearching(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
        fetchFeedbacks(searchTerm, 1, newFilter);
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
        fetchFeedbacks(currentPage, filter, sortOrder);
        getTotalFeedbacks();
    }, [currentPage, filter, sortOrder]);


    return (
        <>
            <main className="flex-grow px-6 mt-0 xl:mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Feedbacks</h1>
                    <SeedButton />
                </div>

                <FeedbackStats
                    totalFeedbacks={totalFeedbacks}
                    totalClinicFeedbacks={totalClinicFeedbacks}
                    totalDoctorFeedbacks={totalDoctorFeedbacks}
                />

                {
                    isLoading ? (
                        <SkeletonFeedbackTable />
                    ) : (
                        isSearching ? (
                            <FeedbackTable
                                feedbacks={searchResults}
                                filter={filter}
                                searchTerm={searchTerm}
                                onFilterChange={handleFilterChange}
                                onSearchChange={handleSearch}
                                currentPage={currentPage}
                                totalPages={1} 
                                onPageChange={setCurrentPage}
                            />
                        ) : (
                            <FeedbackTable
                                feedbacks={feedbacks}
                                filter={filter}
                                searchTerm={searchTerm}
                                onFilterChange={handleFilterChange}
                                onSearchChange={handleSearch}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )
                    )
                }


            </main>
        </>
    );
}
