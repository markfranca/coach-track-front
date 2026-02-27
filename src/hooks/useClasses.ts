import { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import type { Class } from '../types/class';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await classService.getAll();
      console.log('📚 Turmas recebidas:', data);
      // Garante que sempre seja um array
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('❌ Erro ao carregar turmas:', err);
      console.error('📊 Status:', err.response?.status);
      console.error('📝 Dados:', err.response?.data);
      setError(err.response?.data?.message || 'Erro ao carregar turmas');
      setClasses([]); // Define como array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
  };
};
