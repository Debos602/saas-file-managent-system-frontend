import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditPackageModal from "./EditPackageModal";
import { Plus } from "lucide-react";
import { getPackages, createPackage, updatePackage, deletePackage } from "@/api/subscription";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { SubscriptionPackage } from "@/types/api";
import { TableSkeleton } from "@/components/ui/skeleton";

export default function AdminPackages() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    maxFolders: 0,
    maxNestingLevel: 0,
    allowedFileTypes: "",
    maxFileSizeMB: 0,
    totalFileLimit: 0,
    filesPerFolder: 0,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getPackages(1, 5);
        if (!mounted) return;
        setPackages(res.data || []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load packages");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshPackages() {
    try {
      setLoading(true);
      const res = await getPackages(1, 20);
      setPackages(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload: Record<string, any>) {
    setCreateError(null);
    setCreating(true);
    try {
      if (editingId) {
        await updatePackage(editingId, payload);
      } else {
        await createPackage(payload);
      }
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", maxFolders: 0, maxNestingLevel: 0, allowedFileTypes: "", maxFileSizeMB: 0, totalFileLimit: 0, filesPerFolder: 0 });
      await refreshPackages();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to save package");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const t = toast({
      title: "Delete package",
      description: "Click Delete to confirm removal.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirm delete"
          onClick={async () => {
            t.dismiss();
            try {
              setLoading(true);
              await deletePackage(id);
              await refreshPackages();
              toast({ title: "Package deleted" });
            } catch (err: any) {
              setError(err?.message || "Failed to delete package");
            } finally {
              setLoading(false);
            }
          }}
        >
          Delete
        </ToastAction>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription Packages</h1>
          <p className="text-muted-foreground">Manage your subscription plans</p>
        </div>
        <Button className="gap-1.5" onClick={() => {
          setEditingId(null);
          setForm({ name: "", maxFolders: 0, maxNestingLevel: 0, allowedFileTypes: "", maxFileSizeMB: 0, totalFileLimit: 0, filesPerFolder: 0 });
          setOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          Create Package
        </Button>

        <EditPackageModal
          open={open}
          setOpen={setOpen}
          initial={editingId ? form : null}
          saving={creating}
          error={createError}
          onSave={handleSave}
        />
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="pt-6">
          {loading && <TableSkeleton rows={4} />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Package Name</th>
                    <th className="pb-3 pr-4 font-medium">Max Folders</th>
                    <th className="pb-3 pr-4 font-medium">Max Nesting</th>
                    <th className="pb-3 pr-4 font-medium">File Types</th>
                    <th className="pb-3 pr-4 font-medium">Max Size (MB)</th>
                    <th className="pb-3 pr-4 font-medium">Total Files</th>
                    <th className="pb-3 pr-4 font-medium">Per Folder</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{pkg.name}</td>
                      <td className="py-3 pr-4">{pkg.maxFolders}</td>
                      <td className="py-3 pr-4">{pkg.maxNestingLevel}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs">
                          {pkg.allowedFileTypes[0] === "*" ? "All" : pkg.allowedFileTypes.join(", ")}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{pkg.maxFileSizeMB}</td>
                      <td className="py-3 pr-4">{pkg.totalFileLimit}</td>
                      <td className="py-3 pr-4">{pkg.filesPerFolder}</td>
                      <td className="py-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingId(pkg.id);
                          setForm({
                            name: pkg.name,
                            maxFolders: pkg.maxFolders,
                            maxNestingLevel: pkg.maxNestingLevel,
                            allowedFileTypes: Array.isArray(pkg.allowedFileTypes) ? (pkg.allowedFileTypes[0] === "*" ? "*" : pkg.allowedFileTypes.join(",")) : "",
                            maxFileSizeMB: pkg.maxFileSizeMB,
                            totalFileLimit: pkg.totalFileLimit,
                            filesPerFolder: pkg.filesPerFolder,
                          });
                          setOpen(true);
                        }}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {packages.length === 0 && <p className="mt-4">No packages found.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
