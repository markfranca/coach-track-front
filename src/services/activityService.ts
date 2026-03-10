import api from './api';
import type { Activity } from '../types/class';

export interface ActivityCreate {
  title: string;
  description?: string;
  dueDate?: string;
}

export const activityService = {
  async getByClass(classId: number): Promise<Activity[]> {
    const response = await api.get<Activity[]>(`/class-activities/${classId}`);
    return response.data;
  },

  async create(classId: number, data: ActivityCreate): Promise<Activity> {
    const response = await api.post<Activity>(`/class-activities/${classId}`, data);
    return response.data;
  },

  async update(classId: number, activityId: number, data: Partial<ActivityCreate>): Promise<Activity> {
    const response = await api.put<Activity>(`/class-activities/${classId}/${activityId}`, data);
    return response.data;
  },

  async remove(classId: number, activityId: number): Promise<void> {
    await api.delete(`/class-activities/${classId}/${activityId}`);
  },
};
