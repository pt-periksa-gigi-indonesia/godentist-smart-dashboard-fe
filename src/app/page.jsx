"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserClock, FaUserCheck, FaClinicMedical, FaUserInjured, FaMoneyCheckAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { getDoctors } from '@/api/lib/doctorHandler';

import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#ff4444', '#ffa07a', '#dda0dd', '#8b0000', '#00bfff', '#228b22', '#6a5acd'];

export default function DoctorDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [dataType, setDataType] = useState('transactions');
  const router = useRouter();

  const [totalDoctor, setTotalDoctor] = useState(0);
  const [totalVerDoctor, setTotalVerifiedDoctor] = useState(0);
  const [totalUnverDoctor, setTotalUnverifiedDoctor] = useState(0);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors({});
      console.log('data:', data);
      const verifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "verified");
      setTotalVerifiedDoctor(verifiedDoctors.length);
      const unverifiedDoctors = data.results.filter(doctor => doctor.verificationStatus === "unverified");
      setTotalUnverifiedDoctor(unverifiedDoctors.length);
      setTotalDoctor(data.results.length);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchUserInfo() {
    try {
      const user_id = await getUserId();
      const data = await getUserData(user_id);
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user information:');
    }
  }

  async function authCheck() {
    const isValid = await checkToken();
    if (isValid) {
      fetchUserInfo();
    } else {
      router.push('/login');
    }
  }

  useEffect(() => {
    authCheck();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const fetchedData = {
    doctorsStatus: [  
      { status: 'Unverified Doctors', total: totalUnverDoctor },
      { status: 'Verified Doctors', total: totalVerDoctor }
    ]
  }; 

  const dummyData = {
    unverifiedDoctors: 5,
    verifiedDoctors: 20,
    totalClinics: 10,
    totalPatients: 150,
    totalTransactions: 424200,
    transactionsPerMonth: [
      { month: 'Jan', total: 3000 },
      { month: 'Feb', total: 3200 },
      { month: 'Mar', total: 1800 },
      { month: 'Apr', total: 6000 },
      { month: 'May', total: 4000 },
      { month: 'Jun', total: 7000 },
      { month: 'Jul', total: 3300 },
      { month: 'Aug', total: 2600 },
      { month: 'Sep', total: 3500 },
      { month: 'Oct', total: 2000 },
      { month: 'Nov', total: 4500 },
      { month: 'Dec', total: 4200 }
    ],
    doctorsStatus: [
      { status: 'Unverified Doctors', total: 5 },
      { status: 'Verified Doctors', total: 20 }
    ],
    feedback: [
      { id: 1, user: 'Patient A', feedback: 'Dr. Smith was very helpful and kind.', date: '2024-05-10' },
      { id: 2, user: 'Patient B', feedback: 'Clinic XYZ provided excellent service.', date: '2024-05-11' },
      { id: 3, user: 'Patient C', feedback: 'Dr. Jones could improve communication.', date: '2024-05-12' }
    ],
    popularServices: [
      { id: 1, service: 'Teeth Whitening', count: 150 },
      { id: 2, service: 'Dental Cleaning', count: 120 },
      { id: 3, service: 'Root Canal Treatment', count: 100 },
      { id: 4, service: 'Dental Implants', count: 90 },
      { id: 5, service: 'Orthodontics', count: 80 }
    ]
  };

  const renderChart = () => {
    const data = dataType === 'transactions' ? dummyData.transactionsPerMonth : fetchedData.doctorsStatus;
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey={dataType === 'transactions' ? 'month' : 'status'} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey={dataType === 'transactions' ? 'month' : 'status'} cx="50%" cy="50%" outerRadius={100} fill="#4A5568" label>
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

        {/* Dashboard Content */}
        <main className="flex-grow p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Good Morning, Team!</h1>
          </div>


          <div className="grid grid-cols-4 gap-4">
            {/* Partner's Account */}
            <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-md font-medium text-gray-800 mb-2">Partner's Account</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                  <FaUserClock className="text-xl mr-4" />
                  <div>
                    <h3 className="text-md font-normal">Unverified</h3>
                    <p className="text-xl font-bold">{totalUnverDoctor} doctors</p>
                  </div>
                </div>
                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                  <FaUserCheck className="text-xl mr-4" />
                  <div>
                    <h3 className="text-md font-normal">Verified</h3>
                    <p className="text-xl font-bold">{totalVerDoctor} doctors</p>
                  </div>
                </div>
                <div className="p-2 bg-white text-gray-800 rounded-md flex items-center">
                  <FaClinicMedical className="text-xl mr-4" />
                  <div>
                    <h3 className="text-md font-normal">Total Clinics</h3>
                    <p className="text-xl font-bold">{dummyData.totalClinics} clinics</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Patients */}
            <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-medium text-gray-800">Total Patients</h2>
                <FaUserInjured className="text-lg text-gray-400" />
              </div>
              <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
                <div>
                  <p className="text-2xl font-bold">{dummyData.totalPatients} people</p>
                  <h3 className="text-sm text-gray-400 font-normal pt-1">+31 from last month</h3>
                </div>
              </div>
            </div>
            {/* Transactions */}
            <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-medium text-gray-800">Total Transactions</h2>
                <FaMoneyCheckAlt className="text-lg text-gray-400" />
              </div>
              <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
                <div>
                  <p className="text-2xl font-bold">${dummyData.totalTransactions}</p>
                  <h3 className="text-sm text-gray-400 font-normal pt-1">+26% from last month</h3>
                </div>
              </div>
            </div>
            {/* Overview */}
            <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-800 pb-4">Overview</h2>
                <div className="flex space-x-2">
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="border border-gray-300 rounded p-1 text-gray-800"
                  >
                    <option value="transactions">Total Transactions</option>
                    <option value="doctors">Doctor Status</option>
                  </select>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="border border-gray-300 rounded p-1 text-gray-800"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
              </div>
              {renderChart()}
            </div>
            {/* Feedback */}
            <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 pb-4">Feedback</h2>
              <div className="space-y-2">
                {dummyData.feedback.map(feedback => (
                  <div key={feedback.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-md text-gray-800 font-bold">{feedback.user}</p>
                    <p className="text-sm text-gray-600">{feedback.feedback}</p>
                    <p className="text-xs text-gray-400">{feedback.date}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Popular Services */}
            <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 pb-4">Popular Services</h2>
              <div className="space-y-2">
                {dummyData.popularServices.map(service => (
                  <div key={service.id} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-md text-gray-800 font-bold">{service.service}</p>
                    <p className="text-sm text-gray-600">Number of times booked: {service.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
