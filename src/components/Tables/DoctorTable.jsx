import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, Edit } from 'lucide-react';

import SearchBar from '@/components/Utilities/SearchBar';
import Pagination from '../Utilities/Pagination';
import { Skeleton } from "@/components/ui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

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

import { changeDoctorVerificationStatus, getDoctorById, doctorsOcr, doctorOcrLatest } from '@/api/lib/doctorHandler';

import { FaAddressCard } from "react-icons/fa";

const DoctorTable = ({ doctors, searchTerm, handleSearchChange, currentPage, totalPages, onPageChange, refreshDoctors }) => {
    const router = useRouter();

    const [filter, setFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [OCRData, setOCRData] = useState(null);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isOCRLoading, setIsOCRLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const fetchDoctorDetails = async (doctorId) => {
        try {
            const data = await getDoctorById(doctorId);
            setDoctorDetails(data[0]);
        } catch (error) {
            console.error('Failed to fetch doctor details:', error);
        }
    };

    const fetchDoctorOCRData = async (doctorId) => {
        try {
            const data = await doctorsOcr(doctorId);
            console.log('Doctor OCR data:', data);
            setOCRData(data);
        } catch (error) {
            console.error('Failed to fetch doctor OCR data:', error);
        }
    };

    const fetchDoctorOCRLatest = async (doctorId) => {
        setIsOCRLoading(true);
        try {
            const data = await doctorOcrLatest(doctorId);
            console.log('Doctor OCR data latest:', data);
            setOCRData(data);
        } catch (error) {
            console.error('Failed to fetch doctor OCR data:', error);
        } finally {
            setIsOCRLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDoctor && selectedDoctor.id) {
            fetchDoctorOCRLatest(selectedDoctor.id);
        }
    }, [selectedDoctor]);

    useEffect(() => {
        if (selectedDoctor) {
            fetchDoctorDetails(selectedDoctor.id);
            fetchDoctorOCRData(selectedDoctor.id);
        }

        return () => {
            setDoctorDetails(null);
            setOCRData(null);
        };
    }, [selectedDoctor]);

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

    const toggleImageView = () => {
        setIsImageOpen(!isImageOpen);
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

    const renderFieldData = (data, fieldName) => {
        if (!data) return <Skeleton className="h-6" />;

        return data[fieldName] || "-";
    };

    const handleEditButtonClick = () => {
        setEditFormData({
            nama: OCRData?.nama || "",
            nik: OCRData?.nik || "",
            tempatTanggalLahir: OCRData?.tempatTanggalLahir || "",
            alamat: OCRData?.alamat || "",
            jenisKelamin: OCRData?.jenisKelamin || "",
        });
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        // Implement your edit logic here, such as making an API call to update the doctor details
        console.log('Submitting edited data:', editFormData);
        // Close the edit modal after submission
        setIsEditModalOpen(false);
        // Optionally, refresh the doctor data to reflect the changes
        if (selectedDoctor) {
            fetchDoctorDetails(selectedDoctor.id);
            fetchDoctorOCRData(selectedDoctor.id);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const includesSearchTerm = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const passesFilter = !filter || doctor.verificationStatus === filter;
        return includesSearchTerm && passesFilter;
    });

    return (
        <div>
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
                                <DropdownMenuItem onClick={() => handleFilterChange("rejected")}>
                                    Rejected Doctors
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange("pending")}>
                                    Pending Doctors
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Table>
                        <TableHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
                            <TableRow className="bg-gradient-to-r hover:from-blue-600 hover:to-blue-700">
                                <TableHead className="w-[100px] text-white rounded-tl-2xl">No.</TableHead>
                                <TableHead className="text-white">Name</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white text-center rounded-tr-2xl">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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

                    {isModalOpen && selectedDoctor ? (
                        <Modal isOpen={isModalOpen} onClose={closeModal}>
                            <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
                            <div className="mb-4">
                                {doctorDetails?.cardUrl ? (
                                    <img
                                        src={doctorDetails.cardUrl}
                                        alt="Document"
                                        onClick={toggleImageView}
                                        className="w-40 h-auto mx-auto rounded-md hover:cursor-pointer"
                                    />

                                ) : (
                                    <FaAddressCard className="mx-auto text-3xl" />
                                )}
                            </div>
                            <p><strong>Data KTP:</strong></p>
                            
                            {isOCRLoading ? (
                                <ul className="mb-4">
                                    <li>Nama:  <Skeleton className="h-6" /> </li>
                                    <li>NIK:  <Skeleton className="h-6" /> </li>
                                    <li>Tempat Tanggal Lahir: <Skeleton className="h-6" /></li>
                                    <li>Alamat:  <Skeleton className="h-6" /> </li>
                                    <li>Jenis Kelamin:  <Skeleton className="h-6" /> </li>
                                </ul>
                            ) : OCRData ? (
                                <ul className="mb-4">
                                    <li className="mb-2">
                                        <span className="font-semibold">Nama:</span>
                                        <span className="block mt-1">{renderFieldData(OCRData, 'nama')}</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="font-semibold">NIK:</span>
                                        <span className="block mt-1">{renderFieldData(OCRData, 'nik')}</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="font-semibold">Tempat Tanggal Lahir:</span>
                                        <span className="block mt-1">{renderFieldData(OCRData, 'tempatTanggalLahir')}</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="font-semibold">Alamat:</span>
                                        <span className="block mt-1">{renderFieldData(OCRData, 'alamat')}</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="font-semibold">Jenis Kelamin:</span>
                                        <span className="block mt-1">{renderFieldData(OCRData, 'jenisKelamin')}</span>
                                    </li>
                                </ul>
                            ) : (
                                <p>No OCR data available.</p>
                            )}
                            <p><strong>Status:</strong> {selectedDoctor.verificationStatus}</p>
                            <div className='flex justify-between'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                                
                                <button
                                    className='items-center mt-4 bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600'
                                    onClick={handleEditButtonClick}
                                >
                                    Edit
                                </button>

                                <button
                                    className='items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600'
                                    onClick={() => fetchDoctorOCRLatest(selectedDoctor.id)}
                                >
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                </button>

                            </div>
                        </Modal>
                    ) : null}

                    {isImageOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
                            onClick={toggleImageView}
                        >
                            <img
                                src={doctorDetails.cardUrl}
                                alt="Enlarged document"
                                className="max-w-full max-h-full"
                            />
                        </div>
                    )}

                    {isEditModalOpen && (
                        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                            <h2 className="text-xl font-semibold mb-4">Edit Doctor Information</h2>
                            <form onSubmit={handleEditFormSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">Nama:</label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={editFormData.nama}
                                        onChange={handleEditFormChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">NIK:</label>
                                    <input
                                        type="text"
                                        name="nik"
                                        value={editFormData.nik}
                                        onChange={handleEditFormChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Tempat Tanggal Lahir:</label>
                                    <input
                                        type="text"
                                        name="tempatTanggalLahir"
                                        value={editFormData.tempatTanggalLahir}
                                        onChange={handleEditFormChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Alamat:</label>
                                    <input
                                        type="text"
                                        name="alamat"
                                        value={editFormData.alamat}
                                        onChange={handleEditFormChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Jenis Kelamin:</label>
                                    <input
                                        type="text"
                                        name="jenisKelamin"
                                        value={editFormData.jenisKelamin}
                                        onChange={handleEditFormChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Save
                                </Button>
                            </form>
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