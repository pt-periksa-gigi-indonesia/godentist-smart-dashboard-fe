import React from 'react';
import { FaUser, FaUserShield } from 'react-icons/fa';
import StatCard4 from '@/components/ui/statCard4';

const UserRoleStats = ({ totalUsers, totalAdmins }) => {
    return (
        <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard4 Icon={FaUser} label="Total Users" value={totalUsers} />
                <StatCard4 Icon={FaUserShield} label="Total Admins" value={totalAdmins} />
            </div>
        </div>
    );
};

export default UserRoleStats;
