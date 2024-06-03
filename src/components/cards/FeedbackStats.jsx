import React from 'react';
import { FaComments, FaUser, FaHospital } from "react-icons/fa";
import StatCard4 from '@/components/ui/statCard4';

const FeedbackStats = ({ totalFeedbacks, totalClinicFeedbacks, totalDoctorFeedbacks }) => {
  return (
    <div className="col-span-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-gray-200 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <StatCard4 Icon={FaComments} label="Total Feedbacks" value={(totalFeedbacks !== undefined) && (totalFeedbacks > 0) ? `${totalFeedbacks} feedbacks` : "-"} />
        <StatCard4 Icon={FaHospital} label="Total Clinic Feedbacks" value={(totalClinicFeedbacks !== undefined) && (totalClinicFeedbacks > 0) ? `${totalClinicFeedbacks} feedbacks` : "-"} />
        <StatCard4 Icon={FaUser} label="Total Doctor Feedbacks" value={(totalDoctorFeedbacks !== undefined) && (totalDoctorFeedbacks > 0) ? `${totalDoctorFeedbacks} feedbacks` : "-"} />
      </div>
    </div>
  );
};

export default FeedbackStats;
