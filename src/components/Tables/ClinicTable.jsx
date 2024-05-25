// components/Tables/ClinicTable.js

import Link from 'next/link';

export default function ClinicTable({ clinics }) {
    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            {clinics && clinics.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clinic Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Transactions
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Details</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clinics.map((clinic) => (
                            <tr key={clinic.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{clinic.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900 text-center">{clinic.totalAmountTransactions > 0 ?`${clinic.totalAmountTransactions}` : "it is empty"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/dashboard/clinics/details/${clinic.id}`} className="text-blue-600 hover:text-blue-900">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-6 text-gray-500 text-center">Cannot fetch clinic information right now.</div>
            )}
        </div>
    );
}
