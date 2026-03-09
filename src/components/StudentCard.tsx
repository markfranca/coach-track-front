import type { Student } from '../types/class';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onRemove: (student: Student) => void;
}

export const StudentCard = ({ student, onEdit, onRemove }: StudentCardProps) => {
  const initials = student.person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formatPhone = (phone: string) =>
    phone?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') || '—';

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString('pt-BR') : '—';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{student.person.name}</p>
          <p className="text-sm text-gray-500">{student.person.email}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400">📞 {formatPhone(student.person.phone)}</span>
            <span className="text-xs text-gray-400">🎂 {formatDate(student.person.birthDate)}</span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(student)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar aluno"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(student)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remover aluno"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
