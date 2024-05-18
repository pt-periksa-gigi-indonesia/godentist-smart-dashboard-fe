import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ChevronDown } from 'lucide-react';

import SearchBar from '@/components/Utilities/SearchBar';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem, // Import the DropdownMenuCheckboxItem component
} from "@/components/ui/dropdown-menu"

const DoctorTable = ({ doctors, searchTerm, handleSearchChange }) => {
    const router = useRouter();

    const [filter, setFilter] = useState(null);

    const handleViewDetails = (doctorId) => {
        router.push(`/doctors/details/${doctorId}`);
    };

    const handleChangeStatus = (doctorId) => {
        console.log(`Change status for doctor ${doctorId}`);
    };

    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
    };

    // Filter doctors based on search term and filter
    const filteredDoctors = doctors.filter(doctor => {
        const includesSearchTerm = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const passesFilter = !filter || doctor.verificationStatus === filter;
        return includesSearchTerm && passesFilter;
    });

    return (
        <div>
            <div className="flex py-4">
                <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Filter <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                            All Doctors
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange("verified")}>
                            Verified Doctors
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange("unverified")}>
                            Unverified Doctors
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Table>
                <TableHeader className="bg-gray-50 border border-gray-200">
                    <TableRow>
                        <TableHead className="w-[100px]">No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDoctors.map((doctor, index) => (
                        <TableRow key={doctor.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{doctor.name}</TableCell>
                            <TableCell>{doctor.verificationStatus}</TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewDetails(doctor.id)}>
                                            View Doctor Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleChangeStatus(doctor.id)}>
                                            Change Doctor Status
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default DoctorTable;
