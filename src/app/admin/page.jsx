"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkToken } from "@/api/auth/validateAccessToken";
import { getUserRole } from "@/api/auth/cookiesHandler";
import { getAllUsers, deleteUser, updateUser } from "@/api/lib/userHandler";
import Sidebar from "@/components/Navigation/Sidebar";

export default function Page() {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const router = useRouter();
  const itemsPerPage = 8;

  async function fetchAllUsers(page) {
    try {
      const { results, totalPages } = await getAllUsers({
        limit: itemsPerPage,
        page,
      });
      setAllUsers(results);
      setTotalPages(Math.ceil(totalPages));
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  }

  async function authCheck() {
    const isValid = await checkToken();
    const user_role = await getUserRole();
    if (isValid && user_role === "master") {
      return true;
    } else if (isValid && user_role === "admin") {
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const isValid = await authCheck();
      if (isValid) {
        fetchAllUsers(currentPage);
      } else {
        router.push("/");
      }
    }
    fetchData();
  }, [currentPage]);

  async function handleDelete(userId) {
    try {
      const result = await deleteUser(userId);
      if (result) {
        fetchAllUsers(currentPage);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function openDeleteModal(userId) {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  }

  function confirmDelete() {
    if (selectedUserId) {
      handleDelete(selectedUserId);
      closeModal();
    }
  }

  function closeModal() {
    setSelectedUserId(null);
    setIsModalOpen(false);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function handleEdit(user) {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    };

    try {
      await updateUser(currentUser.id, updatedFields);
      fetchAllUsers(currentPage);
      closeEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <h1 className="text-2xl text-gray-700 font-bold">Master Admin Page</h1>
        <div className="my-2">
          <h2 className="text-lg font-medium text-gray-700">
            Manage User Accounts
          </h2>
        </div>
        {allUsers.length > 0 && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 font-extrabold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs text-gray-500 font-extrabold uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user, index) => {
                  const globalIndex =
                    (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={user.id} className="text-black">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {globalIndex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                className={`px-4 py-2 bg-red-500 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className={`px-4 py-2 bg-blue-500 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 space-y-4 w-1/3">
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
            <div className="bg-white rounded-lg p-6 space-y-4 w-1/3">
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
                    onClick={closeEditModal}
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
      </div>
    </div>
  );
}
