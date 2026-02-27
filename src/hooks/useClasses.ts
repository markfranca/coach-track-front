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
      console.log('📚 Dados recebidos da API:', data);
      
      // Normaliza os dados
      let dataArray: any[];
      
      if (Array.isArray(data)) {
        // Se for um array direto
        dataArray = data;
        console.log('✅ API retornou um array');
      } else if (data && typeof data === 'object' && 'classes' in data) {
        // Se for um objeto com propriedade 'classes'
        const classesData = (data as any).classes;
        dataArray = Array.isArray(classesData) ? classesData : [classesData];
        console.log('✅ API retornou um objeto com propriedade "classes"');
      } else if (data && typeof data === 'object') {
        // Se for um objeto genérico, coloca em um array
        dataArray = [data];
        console.log('⚠️ API retornou um objeto genérico, convertendo...');
      } else {
        dataArray = [];
        console.warn('⚠️ Dados inválidos recebidos da API');
      }
      
      console.log('📦 Array normalizado:', dataArray);
      
      // Processa os dados e adiciona campos computados
      const processedClasses = dataArray.map(c => ({
        ...c,
        studentsCount: c.students?.length || 0,
        category: c.teacher?.specialization || 'Geral'
      }));
      
      console.log('✅ Turmas processadas:', processedClasses);
      console.log('✅ Total de turmas:', processedClasses.length);
      setClasses(processedClasses);
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
