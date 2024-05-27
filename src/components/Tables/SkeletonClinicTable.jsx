// components/Tables/SkeletonClinicTable.js

export function SkeletonClinicTable() {
    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clinic Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Transactions
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Details</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map((index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
