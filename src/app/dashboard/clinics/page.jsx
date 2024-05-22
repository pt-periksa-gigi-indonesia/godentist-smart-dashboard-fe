"use client";
import { useEffect, useState } from 'react';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

import { FaHospital, FaMoneyCheckAlt } from 'react-icons/fa';

import ClinicTable from '@/components/Tables/ClinicTable';
import { SkeletonClinicTable } from '@/components/Tables/SkeletonClinicTable';

export default function ClinicsPage() {
    const [clinics, setClinics] = useState([]);
    const [totalClinics, setTotalClinics] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClinics = async () => {
        setIsLoading(true);
        try {
            // Dummy data
            const data = [
                { id: 1, name: "Clinic A", transactions: 150 },
                { id: 2, name: "Clinic B", transactions: 200 },
                { id: 3, name: "Clinic C", transactions: 250 },
            ];
            setClinics(data);
            setTotalClinics(data.length);
            setTotalTransactions(data.reduce((sum, clinic) => sum + clinic.transactions, 0));
        } catch (error) {
            console.error('Failed to fetch clinics:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Clinics</h1>
                </div>

                <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                            <FaHospital className="text-xl mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Clinics</h3>
                                <p className="text-xl font-bold">{totalClinics} clinics</p>
                            </div>
                        </div>

                        <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                            <FaMoneyCheckAlt className="text-xl mr-4" />
                            <div>
                                <h3 className="text-md font-normal">Total Transactions</h3>
                                <p className="text-xl font-bold">{totalTransactions} transactions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonClinicTable />
                ) : (
                    <ClinicTable
                        clinics={clinics}
                    />
                )}
            </main>
        </>
    );
}
