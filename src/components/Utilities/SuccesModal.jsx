import React from "react";

const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-xl shadow-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
                <div className="text-green-700 font-semibold">{message}</div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
