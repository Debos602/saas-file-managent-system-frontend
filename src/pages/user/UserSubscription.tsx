import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, HardDrive, FolderTree, FileUp, Layers, FileType, Star, Crown, Zap } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";

export default function UserSubscription() {
  const { activePackage, packages } = useSubscription();

  // Package icons and colors
  const packageStyles = {
    free: {
      icon: Star,
      color: "from-slate-400 to-slate-600",
      bg: "bg-slate-50 dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      button: "secondary"
    },
    pro: {
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      button: "default"
    },
    enterprise: {
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      button: "default"
    }
  };

  const formatFileTypes = (types: string[]) => {
    if (types[0] === "*") return "All file types";
    return types.map(type => type.toUpperCase()).join(", ");
  };

  const getPackageStyle = (pkgName: string) => {
    const name = pkgName.toLowerCase();
    if (name.includes('pro')) return packageStyles.pro;
    if (name.includes('enterprise') || name.includes('premium')) return packageStyles.enterprise;
    return packageStyles.free;
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Choose the perfect plan for your needs. Upgrade anytime to unlock more features.
          </p>
        </div>
      </div>

      {/* Current Plan Summary (if not on free tier) */}
      {activePackage.name !== "Free" && (
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-bold">{activePackage.name}</h3>
                  <Badge className="bg-primary/20 text-primary border-0 rounded-full px-3">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="font-semibold">45% of 100 GB</p>
                </div>
                <Button variant="outline" className="rounded-full">
                  Manage Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const isCurrent = pkg.id === activePackage.id;
          const style = getPackageStyle(pkg.name);
          const Icon = style.icon;

          return (
            <Card
              key={pkg.id}
              className={cn(
                "group relative rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 overflow-hidden",
                isCurrent ? "border-primary shadow-lg" : style.border,
                style.bg
              )}
            >
              {/* Gradient Background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                style.color
              )} />
              
              {/* Popular Tag (for Pro) */}
              {pkg.name === "Pro" && !isCurrent && (
                <div className="absolute top-5 right-5">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 rounded-full px-3">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Enterprise Tag */}
              {pkg.name === "Enterprise" && !isCurrent && (
                <div className="absolute top-5 right-5">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-full px-3">
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br text-white",
                    style.color
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                {/* <CardDescription className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-3xl font-bold text-foreground">
                    {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                  </span>
                  {pkg.price > 0 && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                </CardDescription> */}

                {isCurrent && (
                  <Badge className="mt-3 bg-primary text-primary-foreground rounded-full px-4 py-1">
                    Current Plan
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={cn("p-2 rounded-lg", style.bg)}>
                      <FolderTree className={cn("h-4 w-4", style.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Folders</p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.maxFolders === -1 ? 'Unlimited' : `Up to ${pkg.maxFolders} folders`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {pkg.maxFolders === -1 ? <span className="text-xl leading-none">∞</span> : pkg.maxFolders}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={cn("p-2 rounded-lg", style.bg)}>
                      <HardDrive className={cn("h-4 w-4", style.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Storage</p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.totalFileLimit === -1 ? 'Unlimited' : `Max ${pkg.totalFileLimit} files`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {pkg.totalFileLimit === -1 ? <span className="text-xl leading-none">∞</span> : pkg.totalFileLimit}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={cn("p-2 rounded-lg", style.bg)}>
                      <FileUp className={cn("h-4 w-4", style.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">File Size Limit</p>
                      <p className="text-xs text-muted-foreground">
                        Per file
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {pkg.maxFileSizeMB === -1 ? 'Unlimited' : `${pkg.maxFileSizeMB} MB`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={cn("p-2 rounded-lg", style.bg)}>
                      <Layers className={cn("h-4 w-4", style.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nesting Levels</p>
                      <p className="text-xs text-muted-foreground">
                        Folder depth
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {pkg.maxNestingLevel === -1 ? <span className="text-xl leading-none">∞</span> : pkg.maxNestingLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={cn("p-2 rounded-lg", style.bg)}>
                      <FileType className={cn("h-4 w-4", style.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">File Types</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {formatFileTypes(pkg.allowedFileTypes)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={cn(
                    "w-full rounded-xl h-12 text-base font-medium transition-all",
                    isCurrent && "bg-muted hover:bg-muted/80 cursor-default",
                    !isCurrent && pkg.name === "Pro" && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white",
                    !isCurrent && pkg.name === "Enterprise" && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  )}
                  variant={isCurrent ? "secondary" : style.button as "default" | "outline" | "secondary"}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Current Plan
                    </span>
                  ) : (
                    'Upgrade Now'
                  )}
                </Button>

                {/* Feature Highlight for Enterprise */}
                {pkg.name === "Enterprise" && (
                  <div className="text-center">
                    <Badge variant="outline" className="rounded-full text-xs">
                      Priority Support & Custom Solutions
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card className="rounded-xl border-0 bg-gradient-to-br from-muted/50 to-muted/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Cancel anytime</p>
              <p className="text-xs text-muted-foreground">No hidden fees</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-0 bg-gradient-to-br from-muted/50 to-muted/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Secure payment</p>
              <p className="text-xs text-muted-foreground">256-bit encrypted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-0 bg-gradient-to-br from-muted/50 to-muted/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">24/7 Support</p>
              <p className="text-xs text-muted-foreground">For Pro & Enterprise</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ or Contact Section */}
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-primary/10 mt-8">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Need a custom plan?</h3>
          <p className="text-muted-foreground mb-4">
            Contact us for enterprise solutions with custom requirements
          </p>
          <Button variant="outline" className="rounded-full">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}