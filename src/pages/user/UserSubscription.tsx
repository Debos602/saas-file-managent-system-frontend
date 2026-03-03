import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function UserSubscription() {
  const { activePackage, packages } = useSubscription();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Subscription</h1>
        <p className="text-muted-foreground">Choose the plan that fits your needs</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const isCurrent = pkg.id === activePackage.id;
          return (
            <Card
              key={pkg.id}
              className={`rounded-2xl shadow-md transition-shadow hover:shadow-lg ${
                isCurrent ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                {isCurrent && (
                  <Badge className="mx-auto mt-1 bg-primary text-primary-foreground">
                    Current Plan
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {pkg.maxFolders} folders
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {pkg.totalFileLimit} total files
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {pkg.maxFileSizeMB} MB max file size
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {pkg.maxNestingLevel} nesting levels
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {pkg.allowedFileTypes[0] === "*"
                      ? "All file types"
                      : pkg.allowedFileTypes.join(", ")}
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? "secondary" : "default"}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
