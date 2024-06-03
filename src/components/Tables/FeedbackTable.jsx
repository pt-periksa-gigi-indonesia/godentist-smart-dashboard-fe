import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Edit } from 'lucide-react';

import SearchBar from '@/components/Utilities/SearchBar';
import Pagination from '../Utilities/Pagination';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function FeedbackTable({ feedbacks, filter, searchTerm, onFilterChange, onSearchChange, currentPage, totalPages, onPageChange }) {

    return (
        <div>
            {feedbacks ? (
                <>
                    <div className="flex flex-col sm:flex-row py-4 space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
                        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="sm:ml-auto">
                                    {filter === 'doctor' ? 'Doctor Feedbacks' : 'Clinic Feedbacks'} <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="sm:align-end">
                                <DropdownMenuItem onClick={() => onFilterChange("doctor")}>
                                    Filter by Doctor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onFilterChange("clinic")}>
                                    Filter by Clinic
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                        <Table className="min-w-full table-auto">
                            <TableHeader className="bg-gradient-to-r from-blue-500 to-blue-600 border border-gray-200">
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        No.
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Recipient
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Feedback
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Date
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedbacks.length > 0 ? (
                                    feedbacks.map((feedback, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(currentPage - 1) * 8 + index + 1}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {feedback.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-lg break-words">
                                                {feedback.feedback}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(feedback.createdAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="4" className="px-6 py-4 text-center text-sm text-gray-900">
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                </>
            ) : (
                <div className="p-6 text-gray-500 text-center">Cannot fetch feedback information right now.</div>
            )}
        </div>
    );
}
