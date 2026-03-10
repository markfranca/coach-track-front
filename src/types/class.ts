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

export interface Person {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  personId: number;
  classId: number;
  createdAt: string;
  updatedAt: string;
  person: Person;
}

export interface Absence {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  reason?: string;
  createdAt: string;
  student?: Student;
}

export interface Activity {
  id: number;
  classId: number;
  title: string;
  description?: string;
  dueDate?: string;
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
