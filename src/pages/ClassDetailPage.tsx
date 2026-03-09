import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { StudentCard } from '../components/StudentCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { studentService } from '../services/studentService';
import type { StudentCreate } from '../services/studentService';
import type { Student } from '../types/class';

// ─── Modal de Adicionar / Editar ────────────────────────────────────────────
interface StudentFormModalProps {
  classId: number;
  student?: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

const StudentFormModal = ({ classId, student, onClose, onSuccess }: StudentFormModalProps) => {
  const isEdit = !!student;
  const [form, setForm] = useState<StudentCreate>({
    name: student?.person.name || '',
    email: student?.person.email || '',
    cpf: student?.person.cpf || '',
    phone: student?.person.phone || '',
    birthDate: student?.person.birthDate?.slice(0, 10) || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await studentService.update(classId, student!.id, form);
      } else {
        await studentService.addToClass(classId, form);
      }
      onSuccess();
      onClose();
    } catch {
      setError('Erro ao salvar aluno. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Editar Aluno' : 'Adicionar Aluno'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="João da Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="joao@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
            <input
              type="text"
              required
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 99999-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nascimento</label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal de Confirmar Remoção ──────────────────────────────────────────────
interface ConfirmRemoveModalProps {
  student: Student;
  classId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfirmRemoveModal = ({ student, classId, onClose, onSuccess }: ConfirmRemoveModalProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState('');

  const handleRemove = async () => {
    setIsRemoving(true);
    setError('');
    try {
      await studentService.removeFromClass(classId, student.id);
      onSuccess();
      onClose();
    } catch {
      setError('Erro ao remover aluno. Tente novamente.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Remover Aluno</h3>
        <p className="text-sm text-gray-600 text-center mb-5">
          Tem certeza que deseja remover <span className="font-semibold">{student.person.name}</span> desta turma?
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
          >
            {isRemoving ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Página Principal ────────────────────────────────────────────────────────
export const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classId = Number(id);

  const { classes } = useClasses();
  const { students, isLoading, error, refetch } = useStudents(classId);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [removingStudent, setRemovingStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Busca os dados da turma atual no array de turmas já carregado
  const classesArray = Array.isArray(classes) ? classes : [];
  const currentClass = classesArray.find((c) => c.id === classId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentClass?.name || `Turma #${id}`}
                </h1>
                {currentClass?.schedule && (
                  <p className="text-xs text-gray-500">{currentClass.schedule}</p>
                )}
              </div>
            </div>

            {/* Badge ativa/inativa */}
            {currentClass && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentClass.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {currentClass.isActive ? 'Ativa' : 'Inativa'}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Info da turma */}
        {currentClass && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Professor</p>
                <p className="font-semibold text-gray-900">{currentClass.teacher?.person?.name || '—'}</p>
                <p className="text-sm text-gray-500">{currentClass.teacher?.specialization}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Horário</p>
                <p className="font-semibold text-gray-900">{currentClass.schedule || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Descrição</p>
                <p className="text-sm text-gray-700">{currentClass.description || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Seção de alunos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Alunos</h2>
              {!isLoading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {students.length} {students.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Aluno
            </button>
          </div>

          {/* Loading */}
          {isLoading && <LoadingSpinner />}

          {/* Erro */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Vazio */}
          {!isLoading && !error && students.length === 0 && (
            <EmptyState
              title="Nenhum aluno cadastrado"
              description="Adicione o primeiro aluno a esta turma"
              actionLabel="Adicionar Aluno"
              onAction={() => setShowAddModal(true)}
              icon={
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          )}

          {/* Lista de alunos */}
          {!isLoading && !error && students.length > 0 && (
            <div className="space-y-3">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={(s) => setEditingStudent(s)}
                  onRemove={(s) => setRemovingStudent(s)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal: Adicionar aluno */}
      {showAddModal && (
        <StudentFormModal
          classId={classId}
          onClose={() => setShowAddModal(false)}
          onSuccess={refetch}
        />
      )}

      {/* Modal: Editar aluno */}
      {editingStudent && (
        <StudentFormModal
          classId={classId}
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={refetch}
        />
      )}

      {/* Modal: Confirmar remoção */}
      {removingStudent && (
        <ConfirmRemoveModal
          classId={classId}
          student={removingStudent}
          onClose={() => setRemovingStudent(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

