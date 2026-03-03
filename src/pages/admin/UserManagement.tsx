import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/user";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import type { User } from "../../types/api";
// icons imported above

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Update modal state
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");

    // Fetch users on mount
    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                setLoading(true);
                const res = await getAllUsers();
                if (!mounted) return;
                setUsers(res.data || []);
            } catch (err: unknown) {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
                setError(message || "Failed to load users");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, []);

    // Open update modal and populate form


    // Open delete confirmation modal
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err: unknown) {
            // Handle error (you might want to show a toast or set local error state)
            const message = err instanceof Error ? err.message : String(err);
            console.error("Delete failed:", message);
            alert("Failed to delete user. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    // filtered users
    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u => (u.name || u.email || "").toLowerCase().includes(q));
    }, [users, search]);

    // Loading skeleton (3 placeholder rows)
    const renderSkeletonRows = () => {
        return Array.from({ length: 3 }).map((_, idx) => (
            <tr key={idx} className="animate-pulse bg-card">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-32"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-12"></div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-4 bg-background min-h-screen">
            <h1 className="text-2xl font-semibold text-foreground mb-4">User Management</h1>

            {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-4">
                    <p className="text-destructive-foreground">{error}</p>
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 w-full max-w-lg">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search users by name or email"
                            className="pl-10"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>
                <div>
                    <Button onClick={() => { /* TODO: open create user modal */ }}>
                        <PlusIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Create user</span>
                    </Button>
                </div>
            </div>

            <Card className="rounded-lg shadow">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y">
                                {loading ? renderSkeletonRows() : filteredUsers.map((u, index) => (
                                    <tr key={u.id} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/50 hover:bg-muted'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>{(u.name || u.email || "?").charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">{u.name}</div>
                                                    <div className="text-sm text-muted-foreground">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{u.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">

                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(u)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!loading && filteredUsers.length === 0 && (
                        <div className="text-center py-12 bg-muted">
                            <p className="text-muted-foreground text-sm">No users found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>



            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <Card className="rounded-lg">
                            <CardContent>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Confirm Delete</h3>
                                <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete user <strong className="text-foreground">{userToDelete.name}</strong>? This action cannot be undone.</p>
                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}