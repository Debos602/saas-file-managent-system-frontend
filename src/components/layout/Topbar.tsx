import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowUpCircle, LogOut, RefreshCw, User } from "lucide-react";

export function Topbar() {
  const { user, logout, role } = useAuth();
  console.log("Topbar render - user:", user, "role:", role);
  const { activePackage } = useSubscription();

  if (!user) return null;

  const displayName = user?.name || user?.email || "";
  const initials = displayName
    ? displayName
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
    : "FM";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4">
      <SidebarTrigger className="shrink-0" />

      <div className="flex flex-1 items-center justify-end gap-3">
        {role === "USER" && (
          <>
            {activePackage?.name && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {activePackage.name}
              </Badge>
            )}
            <Button size="sm" variant="outline" className="hidden sm:inline-flex gap-1.5">
              <ArrowUpCircle className="h-3.5 w-3.5" />
              Upgrade
            </Button>
          </>
        )}

        {role === "ADMIN" && (
          <Badge className="hidden sm:inline-flex bg-primary text-primary-foreground">
            Admin
          </Badge>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { }}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Dev: Switch Role
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
