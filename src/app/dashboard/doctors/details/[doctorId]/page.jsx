"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaCalendarAlt, FaBriefcase, FaComments, FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getDoctorById } from "@/api/lib/doctorHandler";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DoctorDetailPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const params = useParams();
    const { doctorId } = params;
    const [doctor, setDoctor] = useState(null);
    const [viewType, setViewType] = useState('Chart');
    const [chartType, setChartType] = useState('Bar');

    async function fetchDoctorById(doctorId) {
        try {
            const data = await getDoctorById(doctorId);
            setDoctor(data[0]);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
        }
    }

    useEffect(() => {
        fetchDoctorById(doctorId);
    }, [doctorId]);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const statisticsData = [
        { name: 'Clinic Patients', value: doctor?.clinicPatientsCount || 0 },
        { name: 'Consultation Patients', value: doctor?.consultationPatientsCount || 0 },
        { name: 'Clinic Revenue', value: doctor?.totalAmountFromClinic || 0 },
        { name: 'Consultation Revenue', value: doctor?.totalAmountFromConsultation || 0 },
    ];

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

    const renderChart = () => {
        switch (chartType) {
            case 'Line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={statisticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'Pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statisticsData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {statisticsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'Bar':
            default:
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statisticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    const renderText = () => (
        <div className="text-gray-800">
            <p><strong>Clinic Patients Count:</strong> {doctor?.clinicPatientsCount !== null ? doctor.clinicPatientsCount : '-'}</p>
            <p><strong>Consultation Patients Count:</strong> {doctor?.consultationPatientsCount !== null ? doctor.consultationPatientsCount : '-'}</p>
            <p><strong>Total Amount From Clinic:</strong> {doctor?.totalAmountFromClinic !== null ? `Rp ${doctor.totalAmountFromClinic.toLocaleString()}` : '-'}</p>
            <p><strong>Total Amount From Consultation:</strong> {doctor?.totalAmountFromConsultation !== null ? `Rp ${doctor.totalAmountFromConsultation.toLocaleString()}` : '-'}</p>
        </div>
    );

    return (
        <>
            <main className="flex-grow p-2 md:p-6 mt-9">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/doctors">Doctors</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{doctor?.name || 'Doctor Details'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-4">Doctor Details</h1>
                {doctor ? (
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex flex-col sm:flex-col md:flex-row items-start mb-4 lg:mb-0">
                            <div className="w-32 h-32 sm:w-32 sm:h-32 rounded-full mb-4 sm:mb-4 sm:mr-4 flex items-center justify-center bg-gray-200">
                                <FaUser className="text-gray-500 text-6xl" />
                            </div>

                            <div className="sm:text-left">
                                <h2 className="text-gray-800 text-2xl font-semibold">{doctor.name || '-'}</h2>
                                <p className="text-gray-600">{doctor.specialization || '-'}</p>
                                <p className="text-gray-600">{doctor.workPlace || '-'}</p>
                                <p className="text-gray-800">Consultation Price: {doctor.consultationPrice ? `Rp ${doctor.consultationPrice.toLocaleString()}` : '-'}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaCalendarAlt className="mr-2" />Work Schedule
                                </h3>
                                {doctor.DoctorWorkSchedule.length > 0 ? doctor.DoctorWorkSchedule.map((schedule) => (
                                    <div key={schedule.id} className="border p-4 rounded-lg mb-2">
                                        <p className="text-gray-800"><strong>Days:</strong> {schedule.fromDay || '-'} to {schedule.untilDay || '-'}</p>
                                        <p className="text-gray-800"><strong>Hours:</strong> {schedule.fromHour || '-'} to {schedule.untilHour || '-'}</p>
                                        <p className="text-gray-800"><strong>Description:</strong> {schedule.description || '-'}</p>
                                        <p className="text-gray-800"><strong>Status:</strong> {schedule.status || '-'}</p>
                                    </div>
                                )) : <p className="text-gray-800">-</p>}
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaChartBar className="mr-2" />Statistics
                                </h3>
                                <div className="flex flex-col md:flex-col lg:flex-col md:items-start lg:items-start mb-4 space-y-2 md:space-y-4 lg:space-y-4">
                                    <div className="flex flex-col md:flex-col lg:flex-col md:items-start lg:items-start">
                                        <label htmlFor="viewType" className="mr-2 text-gray-600">Select View Type:</label>
                                        <select
                                            id="viewType"
                                            value={viewType}
                                            onChange={(e) => setViewType(e.target.value)}
                                            className="border border-gray-300 p-2 rounded"
                                        >
                                            <option value="Chart">Chart</option>
                                            <option value="Text">Text</option>
                                        </select>
                                    </div>
                                    {viewType === 'Chart' && (
                                        <div className="flex flex-col md:flex-col lg:flex-col md:items-start lg:items-start">
                                            <label htmlFor="chartType" className="mr-2 text-gray-600">Select Chart Type:</label>
                                            <select
                                                id="chartType"
                                                value={chartType}
                                                onChange={(e) => setChartType(e.target.value)}
                                                className="border border-gray-300 p-2 rounded"
                                            >
                                                <option value="Bar">Bar Chart</option>
                                                <option value="Line">Line Chart</option>
                                                <option value="Pie">Pie Chart</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                                {viewType === 'Chart' ? renderChart() : renderText()}
                            </div>


                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaBriefcase className="mr-2" />Experience
                                </h3>
                                {doctor.DoctorExperience.length > 0 ? doctor.DoctorExperience.map((experience) => (
                                    <div key={experience.id} className="border p-4 rounded-lg mb-2">
                                        <p className="text-gray-800"><strong>From Year:</strong> {experience.fromYear ? new Date(experience.fromYear).getFullYear() : '-'}</p>
                                        <p className="text-gray-800"><strong>Description:</strong> {experience.description || '-'}</p>
                                    </div>
                                )) : <p className="text-gray-800">-</p>}
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaComments className="mr-2" />Feedback
                                </h3>
                                {doctor.feedback.length > 0 ? doctor.feedback.map((feedback) => (
                                    <div key={feedback.id} className="border p-4 rounded-lg mb-2">
                                        <p className="text-gray-800"><strong>Message:</strong> {feedback.message || '-'}</p>
                                        <p className="text-gray-800"><strong>Date:</strong> {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : '-'}</p>
                                    </div>
                                )) : <p className="text-gray-800">Feedback is currently empty.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading doctor information...</p>
                )}
            </main>
        </>
    );
}
