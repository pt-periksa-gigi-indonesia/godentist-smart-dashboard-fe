import React from 'react';
import { FaUser, FaUserClock, FaUserCheck } from "react-icons/fa";
import StatCard from '@/components/ui/statCard';  

const DoctorStats = ({ totalDoctor, totalUnverDoctor, totalVerDoctor }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
      <div className="grid grid-cols-3 gap-2">
        <StatCard Icon={FaUser} label="Total Doctor" value={totalDoctor !== undefined ?`${totalDoctor} doctors`: "-"} />
        <StatCard Icon={FaUserClock} label="Unverified" value={totalUnverDoctor !== undefined ?`${totalUnverDoctor} doctors`:"-"} />
        <StatCard Icon={FaUserCheck} label="Verified" value={totalVerDoctor !== undefined ?`${totalVerDoctor} doctors`:"-"} />
      </div>
    </div>
  );
};

export default DoctorStats;
