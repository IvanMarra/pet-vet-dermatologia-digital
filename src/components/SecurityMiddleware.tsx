
import React, { useEffect, useState } from 'react';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
}

const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Verificar se JavaScript está habilitado
    const checkSecurity = () => {
      // Verificar se é um navegador real
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
      
      // Verificar se tem WebGL (indicativo de navegador real)
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      // Verificar se tem localStorage
      const hasLocalStorage = (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch (e) {
          return false;
        }
      })();

      // Anti-bot challenges
      const mouseMovements: number[] = [];
      const handleMouseMove = (e: MouseEvent) => {
        mouseMovements.push(e.clientX + e.clientY);
        if (mouseMovements.length > 5) {
          document.removeEventListener('mousemove', handleMouseMove);
          if (mouseMovements.some((pos, i) => i > 0 && Math.abs(pos - mouseMovements[i-1]) > 0)) {
            setIsSecure(true);
          }
        }
      };

      // Verificar movimento do mouse
      document.addEventListener('mousemove', handleMouseMove);

      // Timeout para casos onde não há movimento do mouse
      setTimeout(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (!isBot && gl && hasLocalStorage) {
          setIsSecure(true);
        } else {
          setAttempts(prev => prev + 1);
          if (attempts < 3) {
            setTimeout(checkSecurity, 2000);
          }
        }
      }, 5000);
    };

    checkSecurity();
  }, [attempts]);

  if (!isSecure && attempts >= 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Este site requer JavaScript habilitado e um navegador compatível.
            <br />
            Certifique-se de que está usando um navegador moderno com JavaScript ativo.
          </p>
        </div>
      </div>
    );
  }

  if (!isSecure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando segurança...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecurityMiddleware;
