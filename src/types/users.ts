import { DateTime } from 'luxon';


export interface User {
  id: string;
    email: string;
    role: string;
    person: {
      name: string;
      email?: string;
      phone?: string;
      cpf?: string;
      birthDate?: DateTime;
    };
    profile: {
        id: string;
        specialization: string;
        hireDate: DateTime;
        createdAt: DateTime;
        updatedAt: DateTime;
        personId: number;
    }
}
