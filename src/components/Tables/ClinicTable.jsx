// components/Tables/ClinicTable.js

import Link from 'next/link';

import {
    Table,
} from "@/components/ui/table"

export default function ClinicTable({ clinics }) {
    return (
        <div className="mt-6 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            {clinics && clinics.length > 0 ? (
                <Table>
                    <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-2xl">
                                Clinic Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                Total Transactions
                            </th>
                            <th scope="col" className="relative px-6 py-3 rounded-tr-2xl">
                                <span className="sr-only ">Details</span>
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
                </Table>
            ) : (
                <div className="p-6 text-gray-500 text-center">Cannot fetch clinic information right now.</div>
            )}
        </div>
    );
}
