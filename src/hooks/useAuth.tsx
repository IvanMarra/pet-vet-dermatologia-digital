
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  is_approved: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Verificando usuário logado...');
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Usuário encontrado no localStorage:', userData);
        setUser(userData);
      } else {
        console.log('Nenhum usuário encontrado no localStorage');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      localStorage.removeItem('admin_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.rpc('verify_admin_password', {
        p_email: email,
        p_password: password
      });

      console.log('Resposta da verificação:', data, error);

      if (error) {
        console.error('Erro na verificação:', error);
        return false;
      }

      if (data && data.length > 0 && data[0].is_valid) {
        const { data: adminUser, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data[0].user_id)
          .single();

        console.log('Dados do usuário:', adminUser, userError);

        if (userError) {
          console.error('Erro ao buscar usuário:', userError);
          return false;
        }

        if (adminUser && adminUser.is_approved) {
          const userData = {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            is_approved: adminUser.is_approved
          };
          
          setUser(userData);
          localStorage.setItem('admin_user', JSON.stringify(userData));
          console.log('Login realizado com sucesso');
          return true;
        }
      }
      
      console.log('Credenciais inválidas ou usuário não aprovado');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Executando logout...');
    
    // Limpar estado do usuário
    setUser(null);
    
    // Limpar localStorage
    localStorage.removeItem('admin_user');
    
    // Forçar reload da página para garantir limpeza completa
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const isAdmin = user?.is_approved || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
