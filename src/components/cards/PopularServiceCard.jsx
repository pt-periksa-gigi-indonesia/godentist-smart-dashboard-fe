import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FaStar } from 'react-icons/fa';

export default function PopularServicesCard ({ services }) {
    return (
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm p-0 flex flex-col flex-grow md:col-span-2 col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 w-full">
                <CardTitle className="text-lg font-medium text-gray-800">Popular Services</CardTitle>
                <CardDescription className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md">
                    <FaStar  className="text-lg text-blue-dentist" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
                <ScrollArea className="h-80">
                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <div key={service.id || service.serviceName || index} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                                <p className="text-md text-gray-800 font-bold">{service.serviceName} </p>
                                <p className="text-sm text-blue-dentist">Number of times booked: {service.timesBooked}</p>
                            </div>
                        ))
                    ) : (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-40 mb-2" />
                            </div>
                        ))
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
