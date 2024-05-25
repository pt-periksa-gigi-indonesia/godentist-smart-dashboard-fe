"use client";
import { useEffect, useState } from 'react';
import { FaHospital, FaMoneyCheckAlt } from 'react-icons/fa';

import ClinicTable from '@/components/Tables/ClinicTable';
import { SkeletonClinicTable } from '@/components/Tables/SkeletonClinicTable';

import { getClinics, getClinicTransactions } from '@/api/lib/clinicHandler';

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
            // const test = data.results[0].id;
            // console.log(test);
            // const clinicsData = data.results;
            // console.log(data);
            setTotalClinics(data.totalResults);
           
            // const transactionsData = await Promise.all(data.results.map(async (clinic) => {
            //     try {
            //         const { totalAmountClinic } = await getClinicTransactions(clinic.id);
            //         return {
            //             ...clinic,
            //             transactions: totalAmountClinic
            //         };
            //     } catch (transactionError) {
            //         console.error(`Failed to fetch transactions for clinic ${clinic.id}:`, transactionError);
            //         return {
            //             ...clinic,
            //             transactions: "empty"
            //         };
            //     }
            // }));

            // setClinics(transactionsData);
            setTotalAmountTransactions(data.totalAmountTransactions);

            // console.log(transactionsData);
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
