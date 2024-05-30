import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, Edit } from 'lucide-react';

import SearchBar from '@/components/Utilities/SearchBar';
import Pagination from '../Utilities/Pagination';

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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Modal from '@/components/Utilities/Modal';

import { changeDoctorVerificationStatus } from '@/api/lib/doctorHandler';

const DoctorTable = ({ doctors, searchTerm, handleSearchChange, currentPage, totalPages, onPageChange, refreshDoctors }) => {
    const router = useRouter();

    const [filter, setFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleViewDetails = (doctorId) => {
        router.push(`/dashboard/doctors/details/${doctorId}`);
    };

    const handleChangeStatus = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleStatusUpdate = async (newStatus) => {
        console.log(`Updating status for ${selectedDoctor.name} to ${newStatus}...`);
        try {
            const response = await changeDoctorVerificationStatus(selectedDoctor.id, newStatus);
            console.log('Status updated successfully', response);
            closeModal();
            refreshDoctors();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const includesSearchTerm = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const passesFilter = !filter || doctor.verificationStatus === filter;
        return includesSearchTerm && passesFilter;
    });


    return (
        <div >
            {doctors ? (
                <>
                    <div className="flex py-4">
                        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    {filter === 'verified' ? 'Filter: Verified Doctors' : 
                                    filter === 'unverified' ? 'Filter: Unverified Doctors' : 
                                    filter === 'rejected' ? 'Filter: Rejected Doctors' : 
                                    filter === 'pending' ? 'Filter: Pending Doctors' : 
                                    'Filter: All Doctors'}       
                                    <ChevronDown className="ml-2 h-4 w-4" />
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
                                {/* add rejected */}
                                <DropdownMenuItem onClick={() => handleFilterChange("rejected")}>
                                    Rejected Doctors
                                </DropdownMenuItem>
                                {/* add pending */}
                                <DropdownMenuItem onClick={() => handleFilterChange("pending")}>
                                    Pending Doctors
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
                            {/* if doctor length > 0 */}
                            {/* Check if doctors list is empty */}
                            {doctors.length > 0 ? (
                                filteredDoctors.map((doctor, index) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{doctor.name}</TableCell>
                                        <TableCell
                                            className={
                                                doctor.verificationStatus === "verified"
                                                    ? "text-green-500"
                                                    : doctor.verificationStatus === "rejected"
                                                        ? "text-red-500"
                                                        : "text-gray-500"
                                            }
                                        >
                                            {doctor.verificationStatus}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(doctor.id)}>
                                                        View Doctor Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleChangeStatus(doctor)}>
                                                        Change Doctor Status
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No doctors found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

                    {isModalOpen && selectedDoctor && (
                        <Modal isOpen={isModalOpen} onClose={closeModal}>
                            <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
                            <div className="mb-4">
                                <img src={dummyOCRData.documentPhoto} alt="Document" className="w-40 h-auto mx-auto rounded-md" />
                            </div>
                            <p><strong>Documents:</strong></p>
                            <ul className="mb-4">
                                <li>Document Type: {dummyOCRData.documentType}</li>
                                <li>Name: {selectedDoctor.name}</li>
                                <li>Registration Number: {dummyOCRData.registrationNumber}</li>
                            </ul>
                            <p><strong>Status:</strong> {selectedDoctor.verificationStatus}</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Change Status
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('verified')}>
                                        Verified
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('rejected')}>
                                        Rejected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Modal>
                    )}
                </>
            ) : (
                <div className="p-6 text-gray-500 text-center">Cannot fetch doctor information right now.</div>
            )}

        </div>

    );
};

export default DoctorTable;
