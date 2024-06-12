import React from 'react';
import { FaUser, FaUserClock, FaUserCheck } from "react-icons/fa";
import StatCard4 from '@/components/ui/statCard4';  
import StatCard5 from '@/components/ui/statCard5'; 
import StatCard6 from '@/components/ui/statCard6'; 
import StatCard7 from '@/components/ui/statCard7';
const DoctorStats = ({ totalDoctor, totalUnverDoctor, totalVerDoctor }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <StatCard7 Icon={FaUser} label="Total Doctor" value={totalDoctor !== undefined ?`${totalDoctor} doctors`: "-"} />
        <StatCard6 Icon={FaUserCheck} label="Verified" value={totalVerDoctor !== undefined ?`${totalVerDoctor} doctors`:"-"} />
        <StatCard5 Icon={FaUserClock} label="Unverified" value={totalUnverDoctor !== undefined ?`${totalUnverDoctor} doctors`:"-"} />
      </div>
    </div>
  );
};

export default DoctorStats;
