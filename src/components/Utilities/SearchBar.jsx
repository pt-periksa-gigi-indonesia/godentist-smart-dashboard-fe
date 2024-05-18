import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="flex items-center mb-6 text-black">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={onSearchChange}
                className="border-2 border-gray-200 rounded-lg p-2 w-2/4"
            />
        </div>
    );
};

export default SearchBar;
