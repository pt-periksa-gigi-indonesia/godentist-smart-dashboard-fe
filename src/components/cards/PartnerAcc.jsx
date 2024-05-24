import React from 'react';
import { FaUserClock, FaUserCheck, FaClinicMedical } from "react-icons/fa";
import StatCard from '@/components/ui/statCard';  

const PartnerStats = ({ totalUnverDoctor, totalVerDoctor, totalClinics }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-md font-medium text-gray-100 mb-2">Partner's Account</h2>
      <div className="grid grid-cols-3 gap-2">
        <StatCard Icon={FaUserClock} label="Unverified" value={`${totalUnverDoctor} doctors`} />
        <StatCard Icon={FaUserCheck} label="Verified" value={`${totalVerDoctor} doctors`} />
        <StatCard Icon={FaClinicMedical} label="Total Clinics" value={`${totalClinics} clinics`} />
      </div>
    </div>
  );
};

export default PartnerStats;