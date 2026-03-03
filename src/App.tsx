import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPackages from "@/pages/admin/AdminPackages";
import UserDashboard from "@/pages/user/UserDashboard";
import UserSubscription from "@/pages/user/UserSubscription";
import UserFiles from "@/pages/user/UserFiles";
import NotFound from "@/pages/NotFound";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App = () => (



  < QueryClientProvider client={queryClient} >
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth pages — no layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin routes */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/packages" element={<AdminPackages />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Route>

                {/* User routes */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/subscription" element={<UserSubscription />} />
                  <Route path="/files" element={<UserFiles />} />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/admin" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider >
);

export default App;
