import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAngleRight, faAnglesRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4 space-x-4">
            <span className="px-4 py-2 text-gray-800">Page {currentPage} of {totalPages}</span>
            <button
                className={`text-gray-800 cursor-pointer flex items-center border border-gray-300 rounded-md py-1 px-2 pl-4 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon icon={faAnglesRight} />
            </button>
        </div>
    );
};

export default Pagination;
