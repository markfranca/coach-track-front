import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      authService.saveAuth(response);
      
      navigate('/class');
    } catch (err: any) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (err.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('💬 Mensagem de erro:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  return {
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: authService.isAuthenticated(),
  };
};
