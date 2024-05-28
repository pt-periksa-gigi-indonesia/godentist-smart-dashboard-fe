import React, { useState } from 'react';
import SearchBar from '@/components/Utilities/SearchBar';
import Pagination from "@/components/Utilities/Pagination";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserTable = ({
    users,
    handleDelete,
    handleEdit,
    searchTerm,
    handleSearchChange,
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });
    const [filter, setFilter] = useState(null);

    const openEditModal = (user) => {
        setCurrentUser(user);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    };

    const confirmDelete = () => {
        if (selectedUserId) {
            handleDelete(selectedUserId);
            closeModal();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleEdit(currentUser);
        closeModal();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleRoleChange = (e) => {
        setCurrentUser((prevUser) => ({
            ...prevUser,
            role: e.target.value,
        }));
    };

    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
    };

    const filteredUsers = users.filter(user => {
        const includesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const passesFilter = !filter || user.role === filter;
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
                            All Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange("user")}>
                            User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange("admin")}>
                            Admin
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Table>
                <TableHeader className="bg-gray-50 border border-gray-200">
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {index + 1 + itemsPerPage * (currentPage - 1)}
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-center">
                                <button
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                    onClick={() => openEditModal(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 space-y-4 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Delete Confirmation
                        </h3>
                        <p className="text-gray-700">
                            Are you sure you want to delete this user?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 space-y-4 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
                        <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
                        <form onSubmit={handleSubmit}>
                            <label className="block text-gray-700">
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={currentUser.name}
                                    onChange={handleInputChange}
                                    className="text-gray-700 mt-1 p-2 w-full border rounded"
                                />
                            </label>
                            <label className="block text-gray-700">
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={currentUser.email}
                                    onChange={handleInputChange}
                                    className="text-gray-700 mt-1 p-2 w-full border rounded"
                                />
                            </label>
                            <fieldset className="mt-4">
                                <legend className="text-sm font-medium text-gray-700">
                                    Role:
                                </legend>
                                <div className="mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={currentUser.role === "user"}
                                            onChange={handleRoleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">User</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={currentUser.role === "admin"}
                                            onChange={handleRoleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">Admin</span>
                                    </label>
                                </div>
                            </fieldset>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
};

export default UserTable;
