import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        // Dummy notifications data
        setNotifications([
            { id: 1, message: 'New appointment scheduled' },
            { id: 2, message: 'Reminder: Meeting at 3 PM' },
            { id: 3, message: 'New message from John' },
        ]);
    }, []);

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" onClick={toggleNotificationDropdown} className="relative">
                    <FontAwesomeIcon icon={faBell} className="text-blue-dentist cursor-pointer text-xl" />
                </Button>
            </DropdownMenuTrigger>
            {isNotificationOpen && (
                <DropdownMenuContent className="w-64" align="end" forceMount>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id}>
                                {notification.message}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>No notifications</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
};

export default Notifications;
