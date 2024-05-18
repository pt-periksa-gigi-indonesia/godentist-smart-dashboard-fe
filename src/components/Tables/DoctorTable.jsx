import React from 'react';
import { useRouter } from 'next/navigation';

const DoctorTable = ({ doctors }) => {
    const router = useRouter();
    // console.log('doctors:', doctors);

    return (
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs text-gray-500 font-extrabold uppercase text-center tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor, index) => (
                    <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.verificationStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <button
                                className="px-4 py-2 text-black rounded"
                                onClick={() => router.push(`/doctors/details/${doctor.id}`)}
                            >
                                Details
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DoctorTable;
