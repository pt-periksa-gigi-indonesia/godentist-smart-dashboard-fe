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
import { getDashboardInfo } from '@/api/lib/dashboardHandler';

import { useRouter } from 'next/navigation';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [lastNotifiedDoctors, setLastNotifiedDoctors] = useState(new Set());
    const router = useRouter();

    // Request permission for desktop notifications
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const showDesktopNotifications = (newNotifications) => {
        if (Notification.permission === "granted") {
            const newDoctorNotifications = newNotifications.filter(
                notification => !lastNotifiedDoctors.has(notification.doctorName)
            );

            newDoctorNotifications.forEach((notification) => {
                new Notification(`Unverified Doctor`, {
                    body: `${notification.doctorName} is unverified`,
                    // icon: '/path/to/icon.png' // Optional icon
                });
                lastNotifiedDoctors.add(notification.doctorName);
            });
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await getDashboardInfo();
            if (data && data.notification) {
                setNotifications(data.notification);
                showDesktopNotifications(data.notification);
            } else {
                setNotifications([]);
                // console.error('No notification data received.');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }
    
    useEffect(() => {
        fetchNotifications(); 

        const intervalId = setInterval(fetchNotifications, 30000); 

        return () => clearInterval(intervalId); 
    }, [lastNotifiedDoctors]); 

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(prev => !prev);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" onClick={toggleNotificationDropdown} className="relative">
                    <FontAwesomeIcon icon={faBell} className="text-blue-dentist cursor-pointer text-xl" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            {isNotificationOpen && (
                <DropdownMenuContent className="w-64 custom-dropdown" align="end" forceMount>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <DropdownMenuItem key={index}
                                // redirect to /dashboard/doctors page
                                onClick={() => router.push(`/dashboard/doctors`)}
                            >
                                {notification.doctorName} is unverified
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
