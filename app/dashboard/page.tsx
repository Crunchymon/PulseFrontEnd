'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
            <p className="text-muted-foreground mb-4">
              Email: {user?.email}
            </p>
            <p>Here you can manage your polls and view your data.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}