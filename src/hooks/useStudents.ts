import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import type { Student } from '../types/class';

export const useStudents = (classId: number) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getByClass(classId);
      const arr = Array.isArray(data) ? data : [];
      setStudents(arr);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar alunos');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchStudents();
  }, [classId]);

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
  };
};
