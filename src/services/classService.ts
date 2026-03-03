import api from './api';
import type { Class } from '../types/class';

export const classService = {
  async getAll(): Promise<Class[]> {
    const response = await api.get<Class[]>('/classes/');
    return response.data;
  },

  async getById(id: number): Promise<Class> {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  async create(data: { name: string; description?: string; schedule?: string }): Promise<Class> {
    const response = await api.post<Class>('/classes/', data);
    return response.data;
  },

  async update(id: number, data: { name?: string; description?: string; schedule?: string }): Promise<Class> {
    const response = await api.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/classes/${id}`);
  },
};
