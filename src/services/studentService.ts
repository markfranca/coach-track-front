import api from './api';
import type { Student } from '../types/class';

export interface StudentCreate {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  birthDate?: string;
}

export interface StudentSummary {
  id: number;
  personId: number;
  person: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
  };
}

export interface StudentSearchParams {
  search?: string;
  teacherId?: string | number;
}

export const studentService = {
  async getByClass(classId: number): Promise<Student[]> {
    const response = await api.get<Student[]>(`/class-students/${classId}/students`);
    return response.data;
  },

  // TODO: ajuste a URL para o endpoint real do backend
  async getByTeacher(params?: StudentSearchParams): Promise<StudentSummary[]> {
    const response = await api.get<StudentSummary[]>('/students', { params });
    return response.data;
  },

  // TODO: ajuste a URL para o endpoint real do backend
  async enrollExisting(classId: number, studentId: number): Promise<Student> {
    const response = await api.post<Student>(`/class-students/${classId}/students/enroll`, { studentId });
    return response.data;
  },

  async addToClass(classId: number, studentData: StudentCreate): Promise<Student> {
    const response = await api.post<Student>(`/class-students/${classId}/students`, studentData);
    return response.data;
  },

  async update(classId: number, studentId: number, studentData: Partial<StudentCreate>): Promise<Student> {
    const response = await api.put<Student>(`/classes/${classId}/students/${studentId}`, studentData);
    return response.data;
  },

  async removeFromClass(classId: number, studentId: number): Promise<void> {
    await api.delete(`/classes/${classId}/students/${studentId}`);
  },
};
