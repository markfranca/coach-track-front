export interface Teacher {
  id: number;
  specialization: string;
  hireDate: string;
  personId: number;
  createdAt: string;
  updatedAt: string;
  person: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Class {
  id: number;
  name: string;
  description?: string;
  schedule: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
  teacher: Teacher;
  students: Student[];
  // Campos computados para compatibilidade
  studentsCount?: number;
  category?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  classId: number;
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
