import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";

export function SkeletonUserTable() {
    return (
        <Table>
            <TableCaption>Loading users...</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="text-center">
                            <Skeleton className="h-8 w-20" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
