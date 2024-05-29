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
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [createSuccessMessage, setCreateSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('All Roles'); 
  const [displayedUsers, setDisplayedUsers] = useState([]);

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

  const fetchUserCount = async () => {
    try {
      const data = await getAllUsers();
  
      // Using reduce to create a count object by role
      const roleCounts = data.rolesCount.reduce((acc, roleObj) => {
        acc[roleObj.role] = roleObj.count;
        return acc;
      }, {});
  
      // Set the counts using the role names
      setTotalAdmins(roleCounts['admin'] || 0);
      setTotalUsers(roleCounts['user'] || 0);
    } catch (error) {
      console.error("Error fetching user count:", error);
      setTotalAdmins(0);
      setTotalUsers(0);
    }
  };
  

  useEffect(() => {
    fetchUserCount();
  }, []
  );
  
  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const { results } = await getAllUsers({ limit: 100 });
      setAllUsers(results);
      setTotalPages(Math.ceil(results.length / itemsPerPage));
      setDisplayedUsers(results.slice(0, itemsPerPage));
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const isValid = await authCheck();
      if (isValid) {
        fetchAllUsers();
      } else {
        router.push("/");
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    let filteredUsers;
    if (filter === 'All Roles') {
      filteredUsers = [...allUsers];
    } else {
      filteredUsers = allUsers.filter(user => {
        const userRole = user.role ? user.role.toLowerCase() : '';
        const roleMatch = userRole === filter.toLowerCase();
        return roleMatch;
      });
    }
  
    const finalFilteredUsers = searchTerm
      ? filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.role ? user.role.toLowerCase().includes(searchTerm) : false)
        )
      : filteredUsers;
  
    setDisplayedUsers(finalFilteredUsers.slice(startIndex, endIndex));
  };
  
  
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(newSearchTerm) ||
      user.email.toLowerCase().includes(newSearchTerm) ||
      user.role.toLowerCase().includes(newSearchTerm)
    );

    // keep the role that is selected too:
    const finalFilteredUsers = filter === 'All Roles'
      ? filteredUsers
      : filteredUsers.filter(user => user.role.toLowerCase() === filter.toLowerCase());

    setDisplayedUsers(finalFilteredUsers.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(finalFilteredUsers.length / itemsPerPage));
    setCurrentPage(1);
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
    setCurrentPage(1);
  
    let filteredUsers;
    if (filterValue === 'All Roles') {
      // If "All Roles" is selected, ignore role filtering
      filteredUsers = [...allUsers];
    } else {
      // Only filter by role if a specific role is selected
      filteredUsers = allUsers.filter(user => {
        const userRole = user.role ? user.role.toLowerCase() : '';
        return userRole === filterValue.toLowerCase();
      });
    }
  
    // Apply search term if it exists
    const finalFilteredUsers = searchTerm
      ? filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.role ? user.role.toLowerCase().includes(searchTerm) : false)
        )
      : filteredUsers;
  
    setDisplayedUsers(finalFilteredUsers.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(finalFilteredUsers.length / itemsPerPage));
  };
  
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

  const closeModalOnSuccess = () => {
    setSuccessMessage(null);
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
            users={displayedUsers}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleFilterChange={handleFilterChange}
            setCreateSuccessMessage={setCreateSuccessMessage}
            filterRole={filter}
          />
        )}
      </div>
    </>
  );
}
