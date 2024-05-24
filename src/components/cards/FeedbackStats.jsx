import React from 'react';
import { FaComments, FaUser, FaHospital } from "react-icons/fa";
import StatCard from '@/components/ui/statCard';  

const FeedbackStats = ({ totalFeedbacks, totalClinicFeedbacks, totalDoctorFeedbacks }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
      <div className="grid grid-cols-3 gap-2">
        <StatCard Icon={FaComments} label="Total Feedbacks" value={`${totalFeedbacks} feedbacks`} />
        <StatCard Icon={FaHospital} label="Total Clinic Feedbacks" value={`${totalClinicFeedbacks} feedbacks`} />
        <StatCard Icon={FaUser} label="Total Doctor Feedbacks" value={`${totalDoctorFeedbacks} feedbacks`} />
      </div>
    </div>
  );
};

export default FeedbackStats;
