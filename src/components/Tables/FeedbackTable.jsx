import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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


export default function FeedbackTable({ feedbacks, filter, searchTerm, onFilterChange, onSearchChange, onSortChange, currentPage, totalPages, onPageChange }) {
    const router = useRouter();

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || feedback.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div className="flex py-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            {filter === 'doctor' ? 'Doctor Feedbacks' : 'Clinic Feedbacks'} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onFilterChange("doctor")}>
                            Filter by Doctor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onFilterChange("clinic")}>
                            Filter by Clinic
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-4">
                            Sort <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSortChange("desc")}>
                            Newest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange("asc")}>
                            Oldest
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </div>
            
            
            <Table>
                <TableHeader className="bg-gray-50 border border-gray-200">
                    <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recipient
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feedback
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredFeedbacks.map((feedback, index) => (
                        <TableRow key={feedback.id}>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{index + 1}</div>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{feedback.name}</div>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{feedback.feedback}</div>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(feedback.createdAt).toLocaleString()}</div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}
