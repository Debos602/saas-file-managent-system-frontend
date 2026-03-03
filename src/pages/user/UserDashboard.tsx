import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Package, 
  FileText, 
  FolderOpen, 
  HardDrive, 
  FileType, 
  Layers,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap,
  Crown,
  Activity,
  PieChart,
  Bell,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Users,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const activityData = [
  { name: 'Mon', files: 4, storage: 2.4 },
  { name: 'Tue', files: 7, storage: 4.2 },
  { name: 'Wed', files: 5, storage: 3.1 },
  { name: 'Thu', files: 9, storage: 5.8 },
  { name: 'Fri', files: 12, storage: 7.2 },
  { name: 'Sat', files: 8, storage: 4.9 },
  { name: 'Sun', files: 6, storage: 3.5 },
];

const recentActivities = [
  { id: 1, action: 'Uploaded', file: 'project-document.pdf', time: '5 minutes ago', icon: Upload, color: 'text-green-500' },
  { id: 2, action: 'Created', file: 'New Folder', time: '2 hours ago', icon: FolderOpen, color: 'text-blue-500' },
  { id: 3, action: 'Downloaded', file: 'image.jpg', time: '5 hours ago', icon: Download, color: 'text-purple-500' },
  { id: 4, action: 'Modified', file: 'presentation.pptx', time: '1 day ago', icon: FileText, color: 'text-orange-500' },
];

const quickActions = [
  { label: 'Upload Files', icon: Upload, color: 'bg-blue-500', onClick: () => {} },
  { label: 'Create Folder', icon: FolderOpen, color: 'bg-green-500', onClick: () => {} },
  { label: 'Share', icon: Users, color: 'bg-purple-500', onClick: () => {} },
  { label: 'Settings', icon: Settings, color: 'bg-gray-500', onClick: () => {} },
];

export default function UserDashboard() {
  const { activePackage, usage } = useSubscription();

  const filePercent = Math.min(Math.round((usage.totalFiles / (activePackage.totalFileLimit === -1 ? 100 : activePackage.totalFileLimit)) * 100), 100);
  const folderPercent = Math.min(Math.round((usage.totalFolders / (activePackage.maxFolders === -1 ? 50 : activePackage.maxFolders)) * 100), 100);
  const storageUsed = 45; // Mock storage usage in GB
  const totalStorage = 100; // Mock total storage in GB
  const storagePercent = Math.round((storageUsed / totalStorage) * 100);

  // Package styling
  const getPackageStyle = () => {
    const name = activePackage.name.toLowerCase();
    if (name.includes('pro')) return { icon: Zap, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-600' };
    if (name.includes('enterprise') || name.includes('premium')) return { icon: Crown, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-600' };
    return { icon: Star, color: 'from-slate-400 to-slate-600', bg: 'bg-slate-50 dark:bg-slate-900/50', text: 'text-slate-600' };
  };

  const packageStyle = getPackageStyle();
  const PackageIcon = packageStyle.icon;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background p-6 md:p-8 border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome back!
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your files today
            </p>
          </div>
          
          {/* Date and Notifications */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-full px-4 py-2 bg-background/50 backdrop-blur">
              <Clock className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
            <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-4 px-3 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={action.onClick}
          >
            <div className={cn("p-2 rounded-lg mr-3 transition-colors group-hover:bg-primary/10", action.color)}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Storage Overview Card - Span 2 columns on large screens */}
        <Card className="lg:col-span-2 rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Storage Overview
                </CardTitle>
                <CardDescription>Your storage usage across all files</CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full px-3">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used Storage</span>
                    <span className="font-medium">{storageUsed} GB / {totalStorage} GB</span>
                  </div>
                  <Progress value={storagePercent} className="h-3 rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                      style={{ width: `${storagePercent}%` }}
                    />
                  </Progress>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalStorage - storageUsed} GB remaining
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Upload className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Uploaded</span>
                    </div>
                    <p className="text-lg font-bold">1.2 GB</p>
                    <span className="text-xs text-green-500">+8%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Download className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Downloaded</span>
                    </div>
                    <p className="text-lg font-bold">0.8 GB</p>
                    <span className="text-xs text-red-500">-3%</span>
                  </div>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorFiles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="storage" stroke="hsl(var(--primary))" fill="url(#colorFiles)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Package Card */}
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Current Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("p-4 rounded-xl mb-4", packageStyle.bg)}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", packageStyle.color)}>
                  <PackageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Plan</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{activePackage.name}</h3>
                    <Badge className="bg-green-500 text-white rounded-full text-xs">Active</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/60 hover:from-primary/90 hover:to-primary/70 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              
              <Button variant="outline" className="w-full rounded-xl" size="sm">
                View Details
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage Cards */}
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Files Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{usage.totalFiles}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl">
                  <FileText className="h-8 w-8 text-primary/40" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">{usage.totalFiles} / {activePackage.totalFileLimit === -1 ? '∞' : activePackage.totalFileLimit}</span>
                </div>
                <Progress 
                  value={filePercent} 
                  className={cn(
                    "h-2 rounded-full",
                    filePercent > 90 ? "bg-red-100" : "bg-muted"
                  )}
                >
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      filePercent > 90 ? "bg-red-500" : "bg-gradient-to-r from-primary to-primary/60"
                    )}
                    style={{ width: `${Math.min(filePercent, 100)}%` }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Folders Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{usage.totalFolders}</p>
                  <p className="text-sm text-muted-foreground">Total Folders</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl">
                  <FolderOpen className="h-8 w-8 text-primary/40" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">{usage.totalFolders} / {activePackage.maxFolders === -1 ? '∞' : activePackage.maxFolders}</span>
                </div>
                <Progress 
                  value={folderPercent} 
                  className={cn(
                    "h-2 rounded-full",
                    folderPercent > 90 ? "bg-red-100" : "bg-muted"
                  )}
                >
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      folderPercent > 90 ? "bg-red-500" : "bg-gradient-to-r from-primary to-primary/60"
                    )}
                    style={{ width: `${Math.min(folderPercent, 100)}%` }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Max File Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePackage.maxFileSizeMB === -1 ? 'Unlimited' : `${activePackage.maxFileSizeMB} MB`}</div>
            <p className="text-xs text-muted-foreground mt-1">Per file limit</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Nesting Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePackage.maxNestingLevel === -1 ? '∞' : activePackage.maxNestingLevel}</div>
            <p className="text-xs text-muted-foreground mt-1">Maximum folder depth</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileType className="h-4 w-4" />
              File Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium truncate">
              {activePackage.allowedFileTypes[0] === "*" 
                ? "All file types supported" 
                : activePackage.allowedFileTypes.map(type => type.toUpperCase()).join(", ")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Allowed formats</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest file operations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={cn("p-2 rounded-lg", activity.color.replace('text', 'bg').replace('500', '100'), 'dark:bg-opacity-20')}>
                  <activity.icon className={cn("h-4 w-4", activity.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span> {activity.file}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs">
                  {activity.action}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts/Warnings if near limits */}
      {(filePercent > 80 || folderPercent > 80) && (
        <Card className="rounded-2xl border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">You're approaching your storage limit</p>
              <p className="text-xs text-muted-foreground">Upgrade your plan to get more space</p>
            </div>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}