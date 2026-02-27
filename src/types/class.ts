export interface Class {
  id: string;
  name: string;
  category: string;
  description?: string;
  studentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  recentClass?: {
    id: string;
    name: string;
    category: string;
  };
}
