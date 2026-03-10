import { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';
import type { Activity } from '../types/class';

export const useActivities = (classId: number) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await activityService.getByClass(classId);
      setActivities(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar atividades');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchActivities();
  }, [classId]);

  return { activities, isLoading, error, refetch: fetchActivities };
};
