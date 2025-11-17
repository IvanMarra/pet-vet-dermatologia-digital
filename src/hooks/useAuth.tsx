import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to defer Supabase calls and prevent deadlock
          setTimeout(() => {
            loadUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      console.log('🔍 Loading profile for user:', authUser.email);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Error loading profile:', profileError);
      } else {
        console.log('✅ Profile loaded:', profile);
      }

      // Check if user is admin
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      if (rolesError) {
        console.error('❌ Error loading roles:', rolesError);
      } else {
        console.log('✅ Roles loaded:', roles);
      }

      const hasAdminRole = roles?.some(r => r.role === 'admin') || false;
      console.log('👤 Is Admin?', hasAdminRole);

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.name || authUser.email?.split('@')[0] || 'User',
      });
      setIsAdmin(hasAdminRole);
      console.log('✅ User state updated, setting loading to false');
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    } finally {
      setLoading(false);
      console.log('✅ Loading set to false');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id);

        const hasAdminRole = roles?.some(r => r.role === 'admin') || false;

        if (!hasAdminRole) {
          await supabase.auth.signOut();
          return { success: false, error: 'Acesso negado. Você não tem permissões de administrador.' };
        }

        return { success: true };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // O perfil será criado automaticamente pelo trigger do banco de dados
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, signUp, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
