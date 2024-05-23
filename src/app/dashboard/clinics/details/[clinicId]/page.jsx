"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClinicById } from '@/api/lib/clinicHandler';


export default function ClinicDetailPage() {
    // get clinic id from the url
    const params = useParams();
    const clinicId = params.clinicId;
    const [clinic, setClinic] = useState({});

    const fetchClinic = async () => {
        try {
            const data = await getClinicById(clinicId);
            console.log(data);
            setClinic(data);
        } catch (error) {
            console.error('Failed to fetch clinic:', error);
        }
    }

    useEffect(() => {
        fetchClinic();
    }, []);
    

    return (
        <div className='flex-grow p-6 mt-16'> 
            <h1>Clinic Detail Page</h1>
            <p>Clinic ID: {clinicId}</p>
        </div>
    );
}
