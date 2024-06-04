import Link from 'next/link';

import Pagination from '../Utilities/Pagination';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye} from "@fortawesome/free-solid-svg-icons";

export default function ClinicTable({ clinics , currentPage, totalPages, onPageChange  }) {
    return (
        <div >
            {clinics && clinics.length > 0 ? (
                <div>
                    <div className="mt-6 mb-6 overflow-x-auto rounded-2xl border border-gray-200">
                        <Table className="min-w-full table-auto">
                            <TableHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
                                <TableRow className="bg-gradient-to-r hover:from-blue-600 hover:to-blue-700">
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-2xl">
                                        Clinic Name
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                        Total Transactions
                                    </TableHead>
                                    <TableHead className="relative px-6 py-3 rounded-tr-2xl">
                                        <span className="sr-only">Details</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clinics.length > 0 ? (
                                    clinics.map((clinic, index) => (
                                        <TableRow key={clinic.id}>
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{clinic.name}</div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900 text-center">{clinic.totalAmountTransactions > 0 ? `${clinic.totalAmountTransactions}` : "it is empty"}</div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
                                                <Link href={`/dashboard/clinics/details/${clinic.id}`} className="text-blue-600 hover:text-blue-900 flex justify-center items-center">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="3" className="px-6 py-4 text-center text-sm text-gray-900">
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination  currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                </div>
            ) : (
                <div className="p-6 text-gray-500 text-center">Cannot fetch clinic information right now.</div>
            )}


        </div>
    );
}
