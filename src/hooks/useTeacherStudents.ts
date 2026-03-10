import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { getErrorMessage } from '../utils/errorUtils';
import type { StudentSummary } from '../services/studentService';

const getTeacherId = (): string | null => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw)?.profile?.id ?? null;
  } catch {
    return null;
  }
};

export const useTeacherStudents = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchStudents = useCallback(async (searchTerm?: string) => {
    const teacherId = getTeacherId();
    if (!teacherId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getByTeacher({ teacherId, search: searchTerm || undefined });
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.students)
        ? (data as any).students
        : [];
      setStudents(list);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Erro ao buscar alunos'));
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce de 400ms ao digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchStudents]);

  return {
    students,
    isLoading,
    error,
    search,
    setSearch,
    refetch: () => fetchStudents(search),
  };
};
