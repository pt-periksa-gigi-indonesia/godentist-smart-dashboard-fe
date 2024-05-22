"use client";
import { useEffect, useState } from 'react';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

import { FaComments } from 'react-icons/fa';

import FeedbackTable from '@/components/Tables/FeedbackTable';
import { SkeletonFeedbackTable } from '@/components/Tables/SkeletonFeedbackTable';

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            // Dummy data
            const data = [
                { id: 1, recipient: "Dr. Smith", message: "Excellent service and friendly staff." },
                { id: 2, recipient: "Clinic A", message: "Clean and well-maintained facilities." },
                { id: 3, recipient: "Dr. Doe", message: "Very professional and caring." },
            ];
            setFeedbacks(data);
            setTotalFeedbacks(data.length);
        } catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Feedbacks</h1>
                </div>

                <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                        <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                            <FaComments className="text-xl mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Feedbacks</h3>
                                <p className="text-xl font-bold">{totalFeedbacks} feedbacks</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonFeedbackTable />
                ) : (
                    <FeedbackTable
                        feedbacks={feedbacks}
                    />
                )}

            </main>
        </>
    );
}
