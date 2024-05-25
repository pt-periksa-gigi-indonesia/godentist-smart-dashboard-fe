"use client";
import { useEffect, useState } from 'react';
import { FaHospital, FaMoneyCheckAlt } from 'react-icons/fa';

import ClinicTable from '@/components/Tables/ClinicTable';
import { SkeletonClinicTable } from '@/components/Tables/SkeletonClinicTable';

import { getClinics } from '@/api/lib/clinicHandler';

import ClinicStats from '@/components/cards/ClinicStats';
import SeedButton from '@/components/seedButton';

export default function ClinicsPage() {
    const [clinics, setClinics] = useState([]);
    const [totalClinics, setTotalClinics] = useState(0);
    const [totalAmountTransactions, setTotalAmountTransactions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClinics = async () => {
        setIsLoading(true);
        try {
            const data = await getClinics();
            setClinics(data.results);
            console.log(data);
            setTotalClinics(data.totalResults);
            setTotalAmountTransactions(data.totalAmountTransactions);
        } catch (error) {
            console.error('Failed to fetch clinics:', error);
        }
        finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchClinics();
    }, []);

    return (
        <>
            <main className="flex-grow px-6 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Clinics</h1>
                    <SeedButton />
                </div>

                <ClinicStats
                    totalClinics={totalClinics}
                    totalTransactions={totalAmountTransactions}
                />

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
