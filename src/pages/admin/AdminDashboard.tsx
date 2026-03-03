import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, FileText, FolderOpen } from "lucide-react";
import getDashboardStats from "@/api/admin";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [recentActivity, setRecentActivity] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getDashboardStats();

        if (!mounted || !data) return;

        // store the raw dashboard-shaped data and activity
        const activity = Array.isArray(data.recentActivity)
          ? data.recentActivity
          : Array.isArray(data.recent_activity)
            ? data.recent_activity
            : Array.isArray(data.activity)
              ? data.activity
              : [];

        setDashboard(data);
        setRecentActivity(activity.slice(0, 20));
      } catch (err) {
        // keep defaults on error
        // console.error(err);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const formatPercent = (v: unknown) => {
    if (v == null || v === "") return "—";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return `${n >= 0 ? "+" : ""}${n}%`;
  };

  const displayStats = [
    {
      label: "Total Users",
      value: dashboard?.totalUsers ?? dashboard?.total_users ?? "—",
      icon: Users,
      change: formatPercent(dashboard?.usersChangePercent ?? dashboard?.usersChange),
    },
    {
      label: "Active Subscriptions",
      value: dashboard?.activeSubscriptions ?? dashboard?.active_subscriptions ?? "—",
      icon: CreditCard,
      change: formatPercent(dashboard?.subscriptionsChangePercent ?? dashboard?.subscriptionsChange),
    },
    {
      label: "Total Files",
      value: dashboard?.totalFiles ?? dashboard?.total_files ?? "—",
      icon: FileText,
      change: formatPercent(dashboard?.filesChangePercent ?? dashboard?.filesChange),
    },
    {
      label: "Total Folders",
      value: dashboard?.totalFolders ?? dashboard?.total_folders ?? "—",
      icon: FolderOpen,
      change: formatPercent(dashboard?.foldersChangePercent ?? dashboard?.foldersChange),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Package</th>
                  <th className="pb-3 pr-4 font-medium">Action</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row: Record<string, unknown>, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{row.user ?? row.name ?? row.username}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                        {row.package ?? row.plan ?? row.subscription ?? "-"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{row.action ?? row.message ?? "-"}</td>
                    <td className="py-3 text-muted-foreground">{row.date ?? row.time ?? row.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
