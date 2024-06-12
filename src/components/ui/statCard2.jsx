import React from 'react';

const StatCard2 = ({ Icon, label, value }) => {
  return (
    <div className="p-2  bg-green-stat text-gray-100 rounded-xl flex items-center">
      <Icon className="text-xl ml-4 mr-4" />
      <div>
        <h3 className="text-md font-normal">{label}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};


export default StatCard2;