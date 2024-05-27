import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAngleRight, faAnglesRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4 mb-6 space-x-4 w-full lg:space-x-4 lg:mt-4 md:space-x-3 md:mt-3 sm:space-x-2 sm:mt-2">
            <span className="py-2 text-gray-800 font-medium lg:text-base md:text-sm sm:text-xs">Page {currentPage} of {totalPages}</span>
            <button
                className={`text-gray-800 cursor-pointer flex items-center border border-gray-300 rounded-md py-1 px-2 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""} lg:py-2 lg:px-4 md:py-2 md:px-3 sm:py-1 sm:px-2`}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon className="h-4 w-4 lg:h-5 lg:w-5 md:h-4 md:w-4 sm:h-3 sm:w-3" icon={faAnglesLeft} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""} lg:py-2 lg:px-4 md:py-2 md:px-3 sm:py-1 sm:px-2`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon className="h-4 w-4 lg:h-5 lg:w-5 md:h-4 md:w-4 sm:h-3 sm:w-3" icon={faAngleLeft} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""} lg:py-2 lg:px-4 md:py-2 md:px-3 sm:py-1 sm:px-2`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon className="h-4 w-4 lg:h-5 lg:w-5 md:h-4 md:w-4 sm:h-3 sm:w-3" icon={faAngleRight} />
            </button>
            <button
                className={`px-4 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""} lg:py-2 lg:px-4 md:py-2 md:px-3 sm:py-1 sm:px-2`}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon className="h-4 w-4 lg:h-5 lg:w-5 md:h-4 md:w-4 sm:h-3 sm:w-3" icon={faAnglesRight} />
            </button>
        </div>
    );
};


export default Pagination;
