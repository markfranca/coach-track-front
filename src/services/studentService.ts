import api from './api';

export interface StudentCreate {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  birthDate?: string;
}

export const studentService = {
  async addToClass(classId: number, studentData: StudentCreate): Promise<any> {
    const response = await api.post(`/classes/${classId}/students`, studentData);
    return response.data;
  },

  async removeFromClass(classId: number, studentId: number): Promise<void> {
    await api.delete(`/classes/${classId}/students/${studentId}`);
  },
};
