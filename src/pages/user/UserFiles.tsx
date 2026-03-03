import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function UserFiles() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Files</h1>
        <p className="text-muted-foreground">Manage your files and folders</p>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold">File Manager</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Coming in Phase 5 — folder tree, file grid, and upload functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
