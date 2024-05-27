import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full z-10">
                <button className="absolute text-4xl top-3 right-5 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    &times;
                </button>
                <div>{children}</div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;
