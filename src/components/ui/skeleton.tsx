import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export function TableSkeleton({ rows = 4 }: { rows?: number; }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-28" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-14" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-14" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-20" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="pb-3 pr-4 font-medium">
                            <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="pb-3 font-medium">
                            <Skeleton className="h-4 w-12" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="border-b last:border-0">
                            <td className="py-3 pr-4 font-medium">
                                <Skeleton className="h-4 w-32" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="py-3 pr-4">
                                <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="py-3">
                                <Skeleton className="h-4 w-12" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Skeleton;
