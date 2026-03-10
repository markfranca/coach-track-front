import { useState, useEffect } from 'react';
import { absenceService } from '../services/absenceService';
import type { Absence } from '../types/class';

export const useAbsences = (classId: number) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbsences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await absenceService.getByClass(classId);
      setAbsences(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar faltas');
      setAbsences([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchAbsences();
  }, [classId]);

  return { absences, isLoading, error, refetch: fetchAbsences };
};
