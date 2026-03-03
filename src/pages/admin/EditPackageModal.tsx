import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    initial: Record<string, any> | null;
    saving: boolean;
    error: string | null;
    onSave: (payload: Record<string, any>) => Promise<void>;
};

export default function EditPackageModal({ open, setOpen, initial, saving, error, onSave }: Props) {
    const [form, setForm] = React.useState(() => ({
        name: "",
        maxFolders: 0,
        maxNestingLevel: 0,
        allowedFileTypes: "",
        maxFileSizeMB: 0,
        totalFileLimit: 0,
        filesPerFolder: 0,
    }));

    React.useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name ?? "",
                maxFolders: initial.maxFolders ?? initial.max_folders ?? 0,
                maxNestingLevel: initial.maxNestingLevel ?? initial.max_nesting_level ?? 0,
                allowedFileTypes: Array.isArray(initial.allowedFileTypes) ? (initial.allowedFileTypes[0] === "*" ? "*" : initial.allowedFileTypes.join(",")) : (initial.allowedFileTypes ?? ""),
                maxFileSizeMB: initial.maxFileSizeMB ?? initial.max_file_size_mb ?? 0,
                totalFileLimit: initial.totalFileLimit ?? initial.total_file_limit ?? 0,
                filesPerFolder: initial.filesPerFolder ?? initial.files_per_folder ?? 0,
            });
        } else {
            setForm({ name: "", maxFolders: 0, maxNestingLevel: 0, allowedFileTypes: "", maxFileSizeMB: 0, totalFileLimit: 0, filesPerFolder: 0 });
        }
    }, [initial]);

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        const payload = {
            name: form.name,
            maxFolders: Number(form.maxFolders) || 0,
            maxNestingLevel: Number(form.maxNestingLevel) || 0,
            allowedFileTypes: form.allowedFileTypes ? form.allowedFileTypes.split(",").map((s) => s.trim()) : [],
            maxFileSizeMB: Number(form.maxFileSizeMB) || 0,
            totalFileLimit: Number(form.totalFileLimit) || 0,
            filesPerFolder: Number(form.filesPerFolder) || 0,
        };

        await onSave(payload);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? "Edit Package" : "Create Package"}</DialogTitle>
                    <DialogDescription>{initial ? "Update package details." : "Create a new subscription package."}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-2">
                    <div>
                        <Label>Name</Label>
                        <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Max Folders</Label>
                            <Input type="number" value={String(form.maxFolders)} onChange={(e) => setForm((s) => ({ ...s, maxFolders: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label>Max Nesting Level</Label>
                            <Input type="number" value={String(form.maxNestingLevel)} onChange={(e) => setForm((s) => ({ ...s, maxNestingLevel: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <div>
                        <Label>Allowed File Types (comma separated)</Label>
                        <Input value={form.allowedFileTypes} onChange={(e) => setForm((s) => ({ ...s, allowedFileTypes: e.target.value }))} placeholder="jpg,png,pdf or * for all" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <Label>Max File Size (MB)</Label>
                            <Input type="number" value={String(form.maxFileSizeMB)} onChange={(e) => setForm((s) => ({ ...s, maxFileSizeMB: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label>Total File Limit</Label>
                            <Input type="number" value={String(form.totalFileLimit)} onChange={(e) => setForm((s) => ({ ...s, totalFileLimit: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label>Files Per Folder</Label>
                            <Input type="number" value={String(form.filesPerFolder)} onChange={(e) => setForm((s) => ({ ...s, filesPerFolder: Number(e.target.value) }))} />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <DialogFooter className="pt-2">
                        <Button type="submit" disabled={saving}>{saving ? (initial ? "Saving..." : "Creating...") : (initial ? "Save" : "Create")}</Button>
                        <DialogClose asChild>
                            <Button variant="ghost" type="button">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
