"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserData, updateUser } from '@/api/lib/userHandler'; 

export default function Page(params) {
    const router = useRouter();
    const userId = params.params.id;
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        // password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Get the user information from the API
    async function fetchUserData() {
        try {
            const data = await getUserData(userId);
            setUser(data);
            console.log(data);
            setFormData({
                name: data.name,
                email: data.email,
                role: data.role
                // password: userData.password,
            });
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userId, formData);
            router.push('/admin'); 
        } catch (error) {
            setErrorMessage(error.message); 
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(userId);
        }
    }, [userId]);

    return (
        <div className='bg-white h-screen'>

            <h1 className="text-2xl font-bold mb-4 text-black">Master Admin Edit Page</h1>
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || user?.name} 
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || user?.email} 
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role || user?.role} // Render original data if form data is empty
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div> */}

                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password || user?.password} // Render original data if form data is empty
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div> */}

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
