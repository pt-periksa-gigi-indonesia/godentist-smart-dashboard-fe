"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";
import { getDoctorById } from "@/api/lib/doctorHandler";

export default function DoctorDetailPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const params = useParams();
    const { doctorId } = params;
    const [doctor, setDoctor] = useState(null);

    // Async function to fetch doctor data by ID
    async function fetchDoctorById(doctorId) {
        try {
            const data = await getDoctorById(doctorId);
            setDoctor(data[0]);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
        }
    }

    // Fetch the doctor data when the component mounts or the doctorId changes
    useEffect(() => {
        fetchDoctorById(doctorId);

    }, [doctorId]);

    console.log(doctor);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };
    if (doctor) {
        console.log("Doctor Name:", doctor.name); // This will log the doctor's name once the state is updated
    } else {
        console.log("Doctor data is not yet loaded");
    }

    return (
        <>
            <main className="flex-grow p-6 mt-16">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Details</h1>
                {doctor ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            {/* <img src={doctor.cardUrl || "/path/to/default-image.jpg"} alt={`${doctor.name || '-'}`} className="w-24 h-24 rounded-full mr-4" /> */}
                            <div>
                                <h2 className="text-gray-600 text-xl font-semibold">{doctor.name || '-'}</h2>
                                <p className="text-gray-600">{doctor.specialization || '-'}</p>
                                <p className="text-gray-600">{doctor.workPlace || '-'}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-gray-600 text-lg font-semibold mb-2">Consultation Price</h3>
                            <p className="text-gray-600">{doctor.consultationPrice ? `Rp ${doctor.consultationPrice.toLocaleString()}` : '-'}</p>
                        </div>

                        <div className="mb-4 text-gray-600">
                            <h3 className="text-lg font-semibold mb-2">Work Schedule</h3>
                            {doctor.DoctorWorkSchedule.length > 0 ? doctor.DoctorWorkSchedule.map((schedule) => (
                                <div key={schedule.id} className="border p-4 rounded-lg mb-2">
                                    <p className="text-gray-600"><strong>Days:</strong> {schedule.fromDay || '-'} to {schedule.untilDay || '-'}</p>
                                    <p className="text-gray-600"><strong>Hours:</strong> {schedule.fromHour || '-'} to {schedule.untilHour || '-'}</p>
                                    <p className="text-gray-600"><strong>Description:</strong> {schedule.description || '-'}</p>
                                    <p className="text-gray-600"><strong>Status:</strong> {schedule.status || '-'}</p>
                                </div>
                            )) : <p>-</p>}
                        </div>

                        <div className="mb-4 text-gray-600">
                            <h3 className="text-lg font-semibold mb-2">Experience</h3>
                            {doctor.DoctorExperience.length > 0 ? doctor.DoctorExperience.map((experience) => (
                                <div key={experience.id} className="border p-4 rounded-lg mb-2">
                                    <p><strong>From Year:</strong> {experience.fromYear ? new Date(experience.fromYear).getFullYear() : '-'}</p>
                                    <p><strong>Description:</strong> {experience.description || '-'}</p>
                                </div>
                            )) : <p>-</p>}
                        </div>

                        <div className="mb-4 text-gray-600">
                            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                            {doctor.feedback.length > 0 ? doctor.feedback.map((feedback) => (
                                <div key={feedback.id} className="border p-4 rounded-lg mb-2">
                                    <p><strong>Message:</strong> {feedback.message || '-'}</p>
                                    <p><strong>Date:</strong> {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : '-'}</p>
                                </div>
                            )) : <p>-</p>}
                        </div>

                        <div className="mb-4 text-gray-600">
                            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                            <p><strong>Clinic Patients Count:</strong> {doctor.clinicPatientsCount !== null ? doctor.clinicPatientsCount : '-'}</p>
                            <p><strong>Consultation Patients Count:</strong> {doctor.consultationPatientsCount !== null ? doctor.consultationPatientsCount : '-'}</p>
                            <p><strong>Total Amount From Clinic:</strong> {doctor.totalAmountFromClinic !== null ? `Rp ${doctor.totalAmountFromClinic.toLocaleString()}` : '-'}</p>
                            <p><strong>Total Amount From Consultation:</strong> {doctor.totalAmountFromConsultation !== null ? `Rp ${doctor.totalAmountFromConsultation.toLocaleString()}` : '-'}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading doctor information...</p>
                )}
            </main>
        </>
    )
}