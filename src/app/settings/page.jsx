"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkToken } from "@/api/auth/validateAccessToken";
import { getUserId } from '@/api/auth/cookiesHandler';
import { getUserData, updateUser } from "@/api/lib/userHandler";
import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";
import SuccessModal from "@/components/Utilities/SuccesModal"; 

export default function ProfileEditPage() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        role: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authCheckAndFetch = async () => {
            const isValid = await checkToken();
            if (!isValid) {
                router.push("/login");
                return;
            }
            fetchUserData();
        };

        authCheckAndFetch();
    }, []);

    const fetchUserData = async () => {
        try {
            const user_id = await getUserId(); 
            const userData = await getUserData(user_id); 
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to load user data.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateUser(user.id, {
                name: user.name,
                email: user.email,
                role: user.role
            });
            setSuccessMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setSuccessMessage(null);
    };

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isCollapsed={isCollapsed} />
            <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                <div className="p-6">
                    <h1 className="text-2xl text-gray-700 font-bold">Edit Profile</h1>
                    {successMessage && (
                        <SuccessModal message={successMessage} onClose={closeModal} />
                    )}
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={user.role}
                                onChange={handleInputChange}
                                className="shadow border rounded-xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
