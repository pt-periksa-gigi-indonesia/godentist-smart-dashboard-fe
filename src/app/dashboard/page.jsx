"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserInjured, FaMoneyCheckAlt, FaCommentDots, FaStar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';
import { getDoctors } from '@/api/lib/doctorHandler';
import { getClinics } from '@/api/lib/clinicHandler';

import PartnerStats from '@/components/cards/PartnerAcc';
import FeedbackCard from '@/components/cards/FeedbackCard';

import { getClinicFeedbacks, getDoctorFeedbacks } from '@/api/lib/feedbacksHandler';

import SeedButton from '@/components/seedButton';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#ff4444', '#ffa07a', '#dda0dd', '#8b0000', '#00bfff', '#228b22', '#6a5acd'];

export default function DoctorDashboard() {
  const [chartType, setChartType] = useState('bar');
  const [dataType, setDataType] = useState('transactions');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  const [totalVerDoctor, setTotalVerifiedDoctor] = useState(0);
  const [totalUnverDoctor, setTotalUnverifiedDoctor] = useState(0);

  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const clinicFeedbacks = await getClinicFeedbacks();
        const doctorFeedbacks = await getDoctorFeedbacks();
        const concatenatedFeedbacks = [...clinicFeedbacks.results, ...doctorFeedbacks.results];
        setFeedbackData(concatenatedFeedbacks);
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

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
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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

  const fetchedData = {
    doctorsStatus: [
      { status: 'Unverified Doctors', total: totalUnverDoctor },
      { status: 'Verified Doctors', total: totalVerDoctor }
    ]
  };

  const dummyData = {
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
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey={dataType === 'transactions' ? 'month' : 'status'} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3a5fd9" radius={[10, 10, 0, 0]} />
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


  const [clinics, setClinics] = useState([]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [totalAmountTransactions, setTotalTransactions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const data = await getClinics();
      setClinics(data.results);
      const totalAmountTransactions = data.totalAmountTransactions;
      setTotalTransactions(totalAmountTransactions);
      const clinicsData = data.results;
      setTotalClinics(data.totalResults);
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
    <main className="flex-grow px-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, <span className="text-blue-dentist">Team!</span>
        </h1>
        <SeedButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Partner's Account */}
        <PartnerStats
          totalUnverDoctor={totalUnverDoctor}
          totalVerDoctor={totalVerDoctor}
          totalClinics={totalClinics}
        />

        {/* Patients */}
        <div className="col-span-2 md:col-span-2 lg:col-span-1 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium text-gray-800">Total Patients</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaUserInjured className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
            <div>
              <p className="text-2xl font-bold">{dummyData.totalPatients} people</p>
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">+31 from last month</h3>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="col-span-2 md:col-span-2 lg:col-span-1 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium text-gray-800">Total Transactions</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaMoneyCheckAlt className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
            <div>
              {/* dalam rupiah */}
              <p className="text-2xl font-bold">Rp {(totalAmountTransactions > 0) && (totalAmountTransactions !== undefined) ? `${totalAmountTransactions}` : "-"}</p>
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">+26% from last month</h3>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="col-span-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-2 md:space-y-0 md:space-x-2">
            <h2 className="text-lg font-medium text-gray-800 pb-4 md:pb-0">Overview</h2>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
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

        <FeedbackCard feedback={feedbackData} />

        {/* Popular Services */}
        <div className="col-span-2 md:col-span-2 lg:col-span-1 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-800">Popular Services</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaStar className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="space-y-2">
            {dummyData.popularServices.map(service => (
              <div key={service.id} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-md text-gray-800 font-bold">{service.service}</p>
                <p className="text-sm text-blue-dentist">Number of times booked: {service.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
