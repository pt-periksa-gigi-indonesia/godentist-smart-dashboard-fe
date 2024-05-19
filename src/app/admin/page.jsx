"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkToken } from "@/api/auth/validateAccessToken";
import { getUserRole } from "@/api/auth/cookiesHandler";
import { getAllUsers, deleteUser, updateUser, updateUserRole } from "@/api/lib/userHandler";
import Sidebar from "@/components/Navigation/Sidebar";
import Navbar from "@/components/Navigation/Navbar";
import SuccessModal from "@/components/Utilities/SuccesModal";

import UserTable from "@/components/Tables/UserTable";
import { SkeletonUserTable } from "@/components/Tables/SkeletonUserTable";

export default function Page() {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const itemsPerPage = 8;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  async function fetchAllUsers(page, searchTerm = '') {
    setIsLoading(true);
    try {
      const { results, totalPages } = await getAllUsers({
        limit: itemsPerPage,
        page,
        name: searchTerm,
      });
      setAllUsers(results);
      setTotalPages(Math.ceil(totalPages));
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);
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
        fetchAllUsers(currentPage, searchTerm);
      } else {
        router.push("/");
      }
    }
    fetchData();
  }, [currentPage, searchTerm]);

  async function handleDelete(userId) {
    console.log("Deleting user with id:", userId);
    try {
      const result = await deleteUser(userId);
      if (result) {
        setSuccessMessage("User deleted successfully!");
        fetchAllUsers(currentPage);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  function closeModalOnSuccess() {
    setSuccessMessage(null);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  async function handleEdit(updatedUser) {
    try {
      const updatedFields = {
        name: updatedUser.name,
        email: updatedUser.email,
      };
      const updatedFieldsRole = {
        role: updatedUser.role,
      };
      await updateUser(updatedUser.id, updatedFields);
      await updateUserRole(updatedUser.id, updatedFieldsRole);
      setSuccessMessage("User updated successfully!");
      fetchAllUsers(currentPage);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }


  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  console.log('allUsers:', allUsers);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {successMessage && (
        <SuccessModal message={successMessage} onClose={closeModalOnSuccess} />
      )}

      <Sidebar isCollapsed={isCollapsed} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />


        <div className="flex flex-col w-full p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage User Accounts</h1>
          </div>

          {isLoading ? (
            <SkeletonUserTable />
          ) : (
            <UserTable
              users={allUsers}
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

        </div>
      </div>
    </div>
  );
}
