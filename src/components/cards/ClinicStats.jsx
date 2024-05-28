import React from 'react';
import { FaHospital, FaMoneyCheckAlt } from "react-icons/fa";
import StatCard from '@/components/ui/statCard';  

const ClinicStats = ({ totalClinics, totalTransactions }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <StatCard Icon={FaHospital} label="Total Clinics" value={totalClinics !== undefined ?`${totalClinics} clinics`:"-"} />
        <StatCard Icon={FaMoneyCheckAlt} label="Total Transactions" value={totalClinics !== undefined ? `Rp ${totalTransactions} `:"Rp -"} />
      </div>
    </div>
  );
};

export default ClinicStats;
