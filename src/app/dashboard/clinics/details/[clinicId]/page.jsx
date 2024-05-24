"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClinicById } from '@/api/lib/clinicHandler';


export default function ClinicDetailPage() {
    // get clinic id from the url
    const params = useParams();
    const clinicId = params.clinicId;
    const [clinic, setClinic] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchClinic = async () => {
        try {
            const data = await getClinicById(clinicId);
            setClinic(data[0]);
            console.log(data[0]);
            setError('');
        } catch (error) {
            setError('Failed to load clinic data. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchClinic();
    }, []);


    return (
        <div className='flex-grow p-6 mt-16'>
            <h1 className='text-xl font-bold mb-4'>Clinic Detail Page</h1>
            <div className='w-full max-w-4xl bg-white shadow-md rounded-lg p-4'>
                { error ? (
                    <p>{error}</p>
                ) : clinic ? (
                    <>
                        <p><strong>Clinic Name:</strong> {clinic.clinicName}</p>
                        <p><strong>Total Patients:</strong> {clinic.totalPatientClinic}</p>
                        <p><strong>Total Revenue:</strong> Rp {clinic.totalAmountClinic}</p>

                        <h2 className='text-lg mt-4 mb-2'>Doctors:</h2>
                        {clinic.clinicDoctorStats?.map((doctor) => (
                            <div key={doctor.idDoctor} className='p-2'>
                                <p><strong>Doctor:</strong> {doctor.doctorName}</p>
                                <p><strong>Specialization:</strong> {doctor.doctorSpecialization}</p>
                                <p><strong>Patients Served:</strong> {doctor.totalPatientDoctor}</p>
                                
                            </div>
                        ))}

                        <h2 className='text-lg mt-4 mb-2'>Services:</h2>
                        {clinic.clinicServiceStats && clinic.clinicServiceStats.length > 0 ? (
                            clinic.clinicServiceStats.map((service) => (
                                <div key={service.serviceName} className='p-2'>
                                    <p><strong>Service:</strong> {service.serviceName}</p>
                                    <p><strong>Price:</strong> Rp {service.servicePrice}</p>
                                    <p><strong>Patients Served:</strong> {service.totalPatientService}</p>
                                </div>
                            ))
                        ) : <p>No services found.</p>}

                        <h2 className='text-lg mt-4 mb-2'>Feedback:</h2>
                        {clinic.clinicFeedback && clinic.clinicFeedback[0] && clinic.clinicFeedback[0].length > 0 ? (
                            clinic.clinicFeedback[0].map((feedback) => (
                                <div key={feedback.id} className='p-2'>
                                    <p><strong>Message:</strong> {feedback.message}</p>
                                    <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : <p>No feedback available.</p>}
                    </>
                ) : (
                    // make it center
                    <div className='flex justify-center items-center h-64'>
                        <p>Clinic information is currently unavailable.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
