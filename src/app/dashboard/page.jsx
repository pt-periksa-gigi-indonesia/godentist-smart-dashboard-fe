"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserInjured, FaMoneyCheckAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { checkToken } from '@/api/auth/validateAccessToken';
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData } from '@/api/lib/userHandler';

import PartnerStats from '@/components/cards/PartnerAcc';
import FeedbackCard from '@/components/cards/FeedbackCard';
import PopularServicesCard from '@/components/cards/PopularServiceCard';

import { getDashboardInfo } from '@/api/lib/dashboardHandler';

import SeedButton from '@/components/seedButton';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#ff4444', '#ffa07a', '#dda0dd', '#8b0000', '#00bfff', '#228b22', '#6a5acd'];

export default function DoctorDashboard() {
  const router = useRouter();
  const [chartType, setChartType] = useState('bar');
  const [dataType, setDataType] = useState('transactions');
  const [greeting, setGreeting] = useState('');

  const [totalVerDoctor, setTotalVerifiedDoctor] = useState(0);
  const [totalUnverDoctor, setTotalUnverifiedDoctor] = useState(0);

  const [feedbackData, setFeedbackData] = useState([]);

  const [totalClinics, setTotalClinics] = useState(0);
  const [totalAmountClinicTransactions, setTotalClinicTransactions] = useState(0);
  const [totalAmountConsultations, setTotalConsultationsTransactions] = useState(0);
  const [totalAmountTransactions, setTotalTransactions] = useState(0);
  const [totalConsultPatients, setTotalConsultPatients] = useState(0);
  const [totalClinicPatients, setTotalClinicPatients] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [popularServices, setPopularServices] = useState([]);
  const [transactionsPerMonth, setTransactionsPerMonth] = useState([]);

  useEffect(() => {
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

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardInfo();
      console.log(data);
      // Feedback
      setFeedbackData(data.latestFeedbacks);
      // Clinic
      setTotalClinics(data.clinicCount);
      setTotalClinicTransactions(data.totalAmountFromClinic);
      setTotalConsultationsTransactions(data.totalAmountFromConsultation);
      setTotalTransactions(data.totalAmountFromClinic + data.totalAmountFromConsultation);
      setTotalConsultPatients(data.consultationPatientsCount);
      setTotalClinicPatients(data.clinicPatientsCount);
      setTotalPatients(data.consultationPatientsCount + data.clinicPatientsCount);
      // Doctor
      const verifiedDoctors = data.doctorCount.find(doctor => doctor.verificationStatus === 'verified');
      const unverifiedDoctors = data.doctorCount.find(doctor => doctor.verificationStatus === 'unverified');
      setTotalVerifiedDoctor(verifiedDoctors ? verifiedDoctors.count : 0);
      setTotalUnverifiedDoctor(unverifiedDoctors ? unverifiedDoctors.count : 0);
      // Services
      setPopularServices(data.popularServices);
      // Transactions
      setTransactionsPerMonth(data.totalTransactionsEachMonth);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchedData = {
    doctorsStatus: [
      { status: 'Unverified Doctors', total: totalUnverDoctor },
      { status: 'Verified Doctors', total: totalVerDoctor }
    ],
    transactionsData: transactionsPerMonth.map(item => ({
      month: item.month,
      total: item.totalRevenue
    }))
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderChart = () => {
    const data = dataType === 'transactions' ? fetchedData.transactionsData : fetchedData.doctorsStatus;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey={dataType === 'transactions' ? 'month' : 'status'} tick={{ fontSize: 15 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip contentStyle={{ fontSize: 15 }} />
            <Bar dataKey="total" fill="#3a5fd9" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey={dataType === 'transactions' ? 'month' : 'status'} cx="50%" cy="50%" outerRadius={100} fill="#4A5568" label={{ fontSize: 12 }}>
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <main className="flex-grow flex-col px-6 xl:mt-16 md:mt-10 sm:mt-6">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="text-2xl text-left font-bold text-gray-800">
          {greeting}, <span className="text-blue-dentist">Team!</span>
        </h1>
        <SeedButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-4 gap-y-4">
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
              <p className="text-2xl font-bold">{totalPatients} people</p>
              {/* <p className="text-2xl font-bold">{totalConsultPatients} <span className='text-sm text-blue-dentist-dark font-normal'>people from consults</span></p> */}
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">Clinic Patients: {totalClinicPatients}, Consult Patients: {totalConsultPatients}</h3>
            </div>
          </div>

          {/* <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium text-gray-800">Consult Patients</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaUserInjured className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
            <div>
              <p className="text-2xl font-bold">{totalConsultPatients} people</p>
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">-----</h3>
            </div>
          </div> */}

        </div>

        {/* Transactions */}
        <div className="col-span-2 md:col-span-2 lg:col-span-1 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2 ">
            <h2 className="text-md font-medium text-gray-800">Clinic Revenue</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaMoneyCheckAlt className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
            <div>
              {/* dalam rupiah */}
              <p className="text-2xl font-bold">Rp {(totalAmountTransactions > 0) && (totalAmountTransactions !== undefined) ? `${totalAmountTransactions}` : "-"}</p>
              {/* <p className="text-2xl font-bold">Rp {(totalAmountConsultations > 0) && (totalAmountConsultations !== undefined) ? `${totalAmountConsultations}` : "-"} <span className='text-sm text-blue-dentist-dark font-normal'>from consults</span></p> */}
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">Clinic: Rp {(totalAmountClinicTransactions > 0) && (totalAmountClinicTransactions !== undefined) ? `${totalAmountClinicTransactions}` : "-"}, Consult: Rp {(totalAmountConsultations > 0) && (totalAmountConsultations !== undefined) ? `${totalAmountConsultations}` : "-"}</h3>
            </div>
          </div>


          {/* <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium text-gray-800">Consult Revenue</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
              <FaMoneyCheckAlt className="text-lg text-blue-dentist" />
            </div>
          </div>
          <div className="p-1 bg-white text-gray-800 rounded-md flex items-center">
            <div>

              <p className="text-2xl font-bold">Rp {(totalAmountConsultations > 0) && (totalAmountConsultations !== undefined) ? `${totalAmountConsultations}` : "-"}</p>
              <h3 className="text-sm text-blue-dentist-dark font-normal pt-1">-----</h3>
            </div>
          </div> */}
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

        {/* Feedback */}
        <FeedbackCard feedback={feedbackData} />

        {/* Popular Services */}
        <PopularServicesCard services={popularServices} />
        
      </div>
    </main>
  );
}
