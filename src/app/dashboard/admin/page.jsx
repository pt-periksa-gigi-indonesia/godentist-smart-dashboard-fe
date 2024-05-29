"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { checkToken } from "@/api/auth/validateAccessToken";
import { getUserRole } from "@/api/auth/cookiesHandler";
import { getAllUsers, deleteUser, updateUser, updateUserRole } from "@/api/lib/userHandler";

import SuccessModal from "@/components/Utilities/SuccesModal";
import UserTable from "@/components/Tables/UserTable";
import { SkeletonUserTable } from "@/components/Tables/SkeletonUserTable";
import UserRoleStats from "@/components/cards/UserRoleStats";
import SeedButton from "@/components/seedButton";

export default function Page() {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const itemsPerPage = 8;
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [createSuccessMessage, setCreateSuccessMessage] = useState(null);


  const fetchAllUsers = async (page, searchTerm = '') => {
    setIsLoading(true);
    try {
      const data = await getAllUsers()
      const { results, totalPages } = await getAllUsers({
        limit: itemsPerPage,
        page,
        name: searchTerm,
      });
      const adminsCount = data.rolesCount[0].count;
      const usersCount = data.rolesCount[1].count;
      setAllUsers(results);
      setTotalPages(Math.ceil(totalPages));
      setTotalAdmins(adminsCount);
      setTotalUsers(usersCount);

    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authCheck = async () => {
    const isValid = await checkToken();
    const user_role = await getUserRole();
    if (isValid && user_role === "master") {
      return true;
    } else if (isValid && user_role === "admin") {
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const isValid = await authCheck();
      if (isValid) {
        fetchAllUsers(currentPage, debouncedSearchTerm);
      } else {
        router.push("/");
      }
    };
    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(debouncedSearchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchTerm]);

  const handleDelete = async (userId) => {
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
  };

  const closeModalOnSuccess = () => {
    setSuccessMessage(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEdit = async (updatedUser) => {
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
  };

  const handleSearchChange = (event) => {
    setDebouncedSearchTerm(event.target.value);
  };

  return (
    <>
      {successMessage && (
        <SuccessModal message={successMessage} onClose={closeModalOnSuccess} />
      )}

      {createSuccessMessage && (
          <SuccessModal message={createSuccessMessage} onClose={() => setCreateSuccessMessage(null)} />
      )}


      <div className="flex flex-col w-full px-6 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage User Accounts</h1>
          <SeedButton />
        </div>

        <UserRoleStats
          totalUsers={totalUsers}
          totalAdmins={totalAdmins}
        />

        {isLoading ? (
          <SkeletonUserTable />
        ) : (
          <UserTable
            users={allUsers}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setCreateSuccessMessage={setCreateSuccessMessage}
          />
        )}
      </div>
    </>
  );
}
