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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { createUser } from '@/api/lib/userHandler';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserTable = ({
    users,
    handleDelete,
    handleEdit,
    handleFilterChange,
    searchTerm,
    handleSearchChange,
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    setCreateSuccessMessage,
    filterRole,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "user",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setIsEditModalOpen(true);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
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


    // Create user form handlers
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (newUser.password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            return;
        }
        setErrorMessage('');

        try {
            const { name, role, email, password } = newUser;
            const response = await createUser({ name, role, email, password });

            if (response) {
                setCreateSuccessMessage("User created successfully!");
                setNewUser({
                    name: "",
                    email: "",
                    role: "user",
                    password: "",
                });
                setConfirmPassword("");
                setIsCreateModalOpen(false);
            }

        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };


    const handleNewUserInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const filteredUsers = users.filter(user => {
        const includesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        return includesSearchTerm;
    });

    return (
        <div>
            <div className="flex py-4 flex-col md:flex-row">
                <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <div className="flex mt-4 md:mt-0 md:ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="mr-2">
                                {filterRole === 'user' ? 'Filter: User' : filterRole === 'admin' ? 'Filter: Admin' : 'Filter: All Roles'}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFilterChange('All Roles')}>
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
                    <Button variant="outline" onClick={openCreateModal}>Create a new user</Button>
                </div>
            </div>

            <Table>
                <TableHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <TableRow className="bg-gradient-to-r hover:from-blue-600 hover:to-blue-700">
                        <TableHead className="w-[100px] text-white rounded-tl-2xl">#</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">Role</TableHead>
                        <TableHead className="text-white text-center rounded-tr-2xl">Action</TableHead>
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
                            <TableCell className="text-center flex justify-center ">
                                <button
                                    className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
                                    onClick={() => openEditModal(user)}
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900 flex items-center"
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <FaTrashAlt className="mr-1" /> Delete
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
                    <div className="bg-white rounded-lg p-6 space-y-4 w-11/12 sm:w-2/3 md:w-1/3 lg:w-1/4">
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

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4 w-11/12 sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/4">
                        <h3 className="text-lg font-semibold text-gray-800">Create New User</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <label className="block text-gray-700">
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleNewUserInputChange}
                                    className="text-gray-700 mt-1 p-2 w-full border rounded"
                                />
                            </label>
                            <label className="block text-gray-700 mt-3">
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleNewUserInputChange}
                                    className="text-gray-700 mt-1 p-2 w-full border rounded"
                                />
                            </label>
                            <label className="block text-gray-700 mt-3">
                                Password:
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleNewUserInputChange}
                                        className="text-gray-700 mt-1 p-2 w-full border rounded"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-400" />
                                    </button>
                                </div>
                            </label>
                            <label className="block text-gray-700 mt-3">
                                Confirm Password:
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="text-gray-700 mt-1 p-2 w-full border rounded"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-400" />
                                    </button>
                                </div>
                            </label>
                            {errorMessage && (
                                <div className="text-red-500 mt-2">{errorMessage}</div>
                            )}
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
                                            checked={newUser.role === "user"}
                                            onChange={handleNewUserInputChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">User</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={newUser.role === "admin"}
                                            onChange={handleNewUserInputChange}
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
                                    Create
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
