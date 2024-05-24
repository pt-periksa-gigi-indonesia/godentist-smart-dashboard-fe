import React, { useState } from 'react';
import { Modal, Input, Radio, Button } from 'shadcn-ui';

const CreateUserModal = ({ isOpen, onClose, onSave }) => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleRoleChange = (e) => {
        setNewUser((prevUser) => ({
            ...prevUser,
            role: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(newUser);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Header>Create New User</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Name:"
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Email:"
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                    />
                    <fieldset className="mt-4">
                        <legend className="text-sm font-medium text-gray-700">
                            Role:
                        </legend>
                        <div className="mt-2">
                            <Radio
                                label="User"
                                name="role"
                                value="user"
                                checked={newUser.role === "user"}
                                onChange={handleRoleChange}
                            />
                            <Radio
                                label="Admin"
                                name="role"
                                value="admin"
                                checked={newUser.role === "admin"}
                                onChange={handleRoleChange}
                            />
                        </div>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create User</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateUserModal;
