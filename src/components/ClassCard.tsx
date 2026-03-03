import { useNavigate } from 'react-router-dom';
import type { Class } from '../types/class';

interface ClassCardProps {
  classData: Class;
  onEdit?: (classData: Class) => void;
  onAddStudent?: (classData: Class) => void;
}

export const ClassCard = ({ classData, onEdit, onAddStudent }: ClassCardProps) => {
  const navigate = useNavigate();

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Programação': 'bg-blue-500',
      'Matemática': 'bg-green-500',
      'Física': 'bg-purple-500',
      'Química': 'bg-orange-500',
      'História': 'bg-red-500',
      'Geografia': 'bg-indigo-500',
      'Português': 'bg-pink-500',
      'Inglês': 'bg-teal-500',
    };
    return colors[category || ''] || 'bg-gray-500';
  };

  const handleClick = () => {
    navigate(`/classes/${classData.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(classData);
  };

  const handleAddStudent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddStudent) onAddStudent(classData);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 overflow-hidden group"
    >
      {/* Header colorido */}
      <div className={`${getCategoryColor(classData.category)} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide">
            {classData.category}
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {classData.name}
        </h3>
        
        {classData.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {classData.description}
          </p>
        )}

        {/* Horário */}
        {classData.schedule && (
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">{classData.schedule}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {classData.studentsCount} {classData.studentsCount === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onAddStudent && (
              <button
                onClick={handleAddStudent}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Adicionar aluno"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar turma"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Arrow indicator for view details */}
        <div className="flex items-center justify-center pt-3 border-t border-gray-100 mt-3">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
