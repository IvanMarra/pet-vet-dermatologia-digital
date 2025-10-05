
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import SecurityMiddleware from '@/components/SecurityMiddleware';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SecurityMiddleware>
      {user && isAdmin ? <AdminDashboard /> : <AdminLogin />}
    </SecurityMiddleware>
  );
};

export default Admin;
