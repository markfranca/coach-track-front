import { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import type { Class } from '../types/class';

const getTeacherId = (): string | null => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.profile?.id ?? null;
  } catch {
    return null;
  }
};

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);

    const teacherId = getTeacherId();
    if (!teacherId) {
      setError('Professor não identificado. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await classService.getAllClassesByTeacherId(teacherId);

      // Normaliza os dados
      let dataArray: any[];
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (data && typeof data === 'object' && 'classes' in data) {
        const classesData = (data as any).classes;
        dataArray = Array.isArray(classesData) ? classesData : [classesData];
      } else {
        dataArray = [];
      }

      const processedClasses = dataArray.map(c => ({
        ...c,
        studentsCount: c.students?.length || 0,
        category: c.teacher?.specialization || 'Geral',
      }));

      setClasses(processedClasses);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar turmas');
      setClasses([]);
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
