import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Package, FileText, FolderOpen, HardDrive, FileType, Layers } from "lucide-react";

export default function UserDashboard() {
  const { activePackage, usage } = useSubscription();

  const filePercent = Math.round((usage.totalFiles / activePackage.totalFileLimit) * 100);
  const folderPercent = Math.round((usage.totalFolders / activePackage.maxFolders) * 100);

  const infoCards = [
    { label: "Current Package", value: activePackage.name, icon: Package },
    {
      label: "Files Used",
      value: `${usage.totalFiles} / ${activePackage.totalFileLimit}`,
      icon: FileText,
      progress: filePercent,
    },
    {
      label: "Folders Used",
      value: `${usage.totalFolders} / ${activePackage.maxFolders}`,
      icon: FolderOpen,
      progress: folderPercent,
    },
    { label: "Max File Size", value: `${activePackage.maxFileSizeMB} MB`, icon: HardDrive },
    {
      label: "Allowed File Types",
      value: activePackage.allowedFileTypes[0] === "*" ? "All" : activePackage.allowedFileTypes.join(", "),
      icon: FileType,
    },
    { label: "Max Nesting Level", value: `${activePackage.maxNestingLevel}`, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your file management overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {infoCards.map((card) => (
          <Card key={card.label} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{card.value}</div>
              {"progress" in card && card.progress !== undefined && (
                <Progress value={card.progress} className="mt-3 h-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
