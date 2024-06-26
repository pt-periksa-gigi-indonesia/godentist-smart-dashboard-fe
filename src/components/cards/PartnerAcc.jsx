import React from 'react';
import { FaUserClock, FaUserCheck, FaClinicMedical } from "react-icons/fa";
import StatCard from '@/components/ui/statCard';  
import StatCard2 from '@/components/ui/statCard2';  
import StatCard3 from '@/components/ui/statCard3';  
import Link from 'next/link';

const PartnerStats = ({ totalUnverDoctor, totalVerDoctor, totalClinics }) => {
  return (
    <Link href="/dashboard/doctors" className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-gray-200 shadow-sm content-center">
      <div className='pt-2 px-4 pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 rounded-xl content-center justify-center my-auto'>
        <h2 className="text-md font-medium text-gray-100 mt-2 mb-2">Partner's Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <StatCard Icon={FaUserClock} label="Unverified" value={(totalUnverDoctor !== undefined && (totalUnverDoctor >= 0)) ?`${totalUnverDoctor} doctors`:"-"} />
          <StatCard2 Icon={FaUserCheck} label="Verified" value={(totalVerDoctor !== undefined ) && (totalVerDoctor >= 0)?`${totalVerDoctor} doctors`:"-"} />
          <StatCard3 Icon={FaClinicMedical} label="Total Clinics" value={(totalClinics !== undefined) && (totalClinics >= 0)  ?`${totalClinics} clinics`:"-"} />
        </div>
      </div>
    </Link>
  );
};

export default PartnerStats;
