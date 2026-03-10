import api from './api';
import type { Absence } from '../types/class';

export interface AbsenceCreate {
  studentId: number;
  date: string;
  reason?: string;
}

export const absenceService = {
  async getByClass(classId: number): Promise<Absence[]> {
    const response = await api.get<Absence[]>(`/class-absences/${classId}`);
    return response.data;
  },

  async create(classId: number, data: AbsenceCreate): Promise<Absence> {
    const response = await api.post<Absence>(`/class-absences/${classId}`, data);
    return response.data;
  },

  async remove(classId: number, absenceId: number): Promise<void> {
    await api.delete(`/class-absences/${classId}/${absenceId}`);
  },
};
