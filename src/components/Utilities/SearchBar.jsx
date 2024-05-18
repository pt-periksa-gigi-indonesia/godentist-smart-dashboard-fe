import React from 'react';
import { Input } from "@/components/ui/input"


const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
            <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={onSearchChange}
                className="max-w-sm border-2 border-gray-200 rounded-lg p-2 w-2/4"
            />
    );
};

export default SearchBar;
