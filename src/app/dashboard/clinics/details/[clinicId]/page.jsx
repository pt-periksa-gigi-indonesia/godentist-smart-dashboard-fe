"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClinicById } from '@/api/lib/clinicHandler';
import { FaUser, FaCalendarAlt, FaBriefcase, FaComments, FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { getClinicFeedbacks } from '@/api/lib/feedbacksHandler';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClinicDetailPage() {
    const params = useParams();
    const { clinicId } = params;
    const [clinic, setClinic] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewType, setViewType] = useState('Chart');
    const [chartType, setChartType] = useState('Bar');
    const [feedbackData, setFeedbackData] = useState([]);

    const fetchClinic = async () => {
        try {
            const data = await getClinicById(clinicId);
            setClinic(data[0]);
            setError('');
        } catch (error) {
            setError('Failed to load clinic data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const data = await getClinicFeedbacks(clinicId);
            setFeedbackData(data.results);
            setError('');
        } catch (error) {
            setError('Failed to load feedback data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchClinic();
        fetchFeedbacks();
    }, [clinicId]);

    const statisticsData = [
        { name: 'Total Patients', value: clinic?.totalPatientClinic || 0 },
        { name: 'Total Revenue', value: clinic?.totalAmountClinic || 0 },
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
                                outer
                                radius={100}
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
            <p><strong>Total Patients:</strong> {clinic?.totalPatientClinic || '-'}</p>
            <p><strong>Total Revenue:</strong> {clinic?.totalAmountClinic ? `Rp ${clinic.totalAmountClinic.toLocaleString('id-ID')}` : '-'}</p>
        </div>
    );

    return (
        <>
            <main className="flex-grow p-6 mt-9">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/clinics">Clinics</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {clinic && (
                                <BreadcrumbPage>{clinic.clinicName || '-'}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-4">Clinic Details</h1>
                {clinic ? (
                    <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex items-center mb-4 lg:mb-0">
                            <div className="w-32 h-32 rounded-full mr-4 flex items-center justify-center bg-gray-200">
                                <FaUser className=" text-6xl text-gray-500" />
                            </div>

                            <div>
                                <h2 className="text-gray-800 text-2xl font-semibold">{clinic.clinicName || '-'}</h2>
                                <p className="text-gray-600">Total Patients: {clinic.totalPatientClinic || '-'}</p>
                                <p className="text-gray-600">Total Revenue: {clinic.totalAmountClinic ? `Rp${clinic.totalAmountClinic.toLocaleString('id-ID')}` : '-'}
                                </p>

                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaBriefcase className="mr-2 text-blue-dentist" />Doctors
                                </h3>
                                {clinic.clinicDoctorStats?.length > 0 ? clinic.clinicDoctorStats.map((doctor) => (
                                    <div key={doctor.idDoctor} className="border p-4 rounded-lg mb-2">
                                        <p className="text-gray-800"><strong>Doctor:</strong> {doctor.doctorName || '-'}</p>
                                        <p className="text-gray-800"><strong>Specialization:</strong> {doctor.doctorSpecialization || '-'}</p>
                                        <p className="text-gray-800"><strong>Patients Served:</strong> {doctor.totalPatientDoctor || '-'}</p>
                                    </div>
                                )) : <p className="text-gray-800">-</p>}
                            </div>


                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-blue-dentist" />Services
                                </h3>
                                {clinic.clinicServiceStats?.length > 0 ? clinic.clinicServiceStats.map((service) => (
                                    <div key={service.serviceName} className="border p-4 rounded-lg mb-2">
                                        <p className="text-gray-800"><strong>Service:</strong> {service.serviceName || '-'}</p>
                                        <p className="text-gray-800"><strong>Price:</strong> {service.servicePrice ? `Rp${service.servicePrice.toLocaleString('id-ID')}` : '-'}</p>
                                        <p className="text-gray-800"><strong>Patients Served:</strong> {service.totalPatientService || '-'}</p>
                                    </div>
                                )) : <p className="text-gray-800">-</p>}
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 text-lg font-semibold mb-2 flex items-center">
                                    <FaChartBar className="mr-2 text-blue-dentist" />Statistics
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
                                    <FaComments className="mr-2 text-blue-dentist" />Feedback
                                </h3>
                                <ScrollArea className="h-80">
                                    {feedbackData.length > 0 ? feedbackData.map((feedback) => (
                                        <div key={feedback.id} className="border p-4 rounded-lg mb-2">
                                            <p className="text-gray-800"><strong>Message:</strong> {feedback.feedback || '-'}</p>
                                            <p className="text-gray-800"><strong>Date:</strong> {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : '-'}</p>
                                        </div>
                                    )) : <p className="text-gray-800">-</p>}
                                </ScrollArea>
                            </div>



                        </div>
                    </div>
                ) : (
                    <p>Clinic information is currently none...</p>
                )}
            </main>
        </>
    );
}    