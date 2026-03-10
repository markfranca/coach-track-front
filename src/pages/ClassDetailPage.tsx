import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { useAbsences } from '../hooks/useAbsences';
import { useActivities } from '../hooks/useActivities';
import { StudentCard } from '../components/StudentCard';
import { AddStudentModal } from '../components/AddStudentModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { studentService } from '../services/studentService';
import { absenceService } from '../services/absenceService';
import { activityService } from '../services/activityService';
import type { StudentCreate } from '../services/studentService';
import type { AbsenceCreate } from '../services/absenceService';
import type { ActivityCreate } from '../services/activityService';
import type { Student, Activity } from '../types/class';

type Tab = 'students' | 'absences' | 'activities';

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

// ─── Modal: Confirmar Remoção de Aluno ──────────────────────────────────────
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover aluno. Tente novamente.');
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
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Cancelar
          </button>
          <button onClick={handleRemove} disabled={isRemoving}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
            {isRemoving ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Registrar Falta ──────────────────────────────────────────────────
interface AbsenceModalProps {
  classId: number;
  students: Student[];
  onClose: () => void;
  onSuccess: () => void;
}

const AbsenceModal = ({ classId, students, onClose, onSuccess }: AbsenceModalProps) => {
  const [form, setForm] = useState<AbsenceCreate>({
    studentId: 0,
    date: new Date().toISOString().slice(0, 10),
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) { setError('Selecione um aluno.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await absenceService.create(classId, { ...form, reason: form.reason || undefined });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar falta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Registrar Falta</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Aluno <span className="text-red-500">*</span></label>
            <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value={0}>Selecione um aluno...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.person.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data <span className="text-red-500">*</span></label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Ex: Viagem, consulta médica..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors text-sm">
              {isSubmitting ? 'Registrando...' : 'Registrar Falta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal: Criar / Editar Atividade ─────────────────────────────────────────
interface ActivityModalProps {
  classId: number;
  activity?: Activity | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ActivityModal = ({ classId, activity, onClose, onSuccess }: ActivityModalProps) => {
  const isEdit = !!activity;
  const [form, setForm] = useState<ActivityCreate>({
    title: activity?.title || '',
    description: activity?.description || '',
    dueDate: activity?.dueDate?.slice(0, 10) || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await activityService.update(classId, activity!.id, { ...form, dueDate: form.dueDate || undefined });
      } else {
        await activityService.create(classId, { ...form, dueDate: form.dueDate || undefined });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar atividade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Editar Atividade' : 'Nova Atividade'}</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Prova bimestral, Exercício de fixação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição <span className="text-gray-400 font-normal">(opcional)</span></label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Descreva a atividade..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de entrega <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm">
              {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal: Confirmar Remoção de Atividade ───────────────────────────────────
interface ConfirmRemoveActivityProps {
  activity: Activity;
  classId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfirmRemoveActivity = ({ activity, classId, onClose, onSuccess }: ConfirmRemoveActivityProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState('');

  const handleRemove = async () => {
    setIsRemoving(true);
    setError('');
    try {
      await activityService.remove(classId, activity.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover atividade.');
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
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Remover Atividade</h3>
        <p className="text-sm text-gray-600 text-center mb-5">
          Tem certeza que deseja remover <span className="font-semibold">"{activity.title}"</span>?
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Cancelar
          </button>
          <button onClick={handleRemove} disabled={isRemoving}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
            {isRemoving ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Aba: Alunos ─────────────────────────────────────────────────────────────
interface StudentsTabProps {
  classId: number;
  students: Student[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const StudentsTab = ({ classId, students, isLoading, error, refetch }: StudentsTabProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [removingStudent, setRemovingStudent] = useState<Student | null>(null);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Alunos</h2>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {students.length} {students.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            Buscar aluno
          </button>
          <button onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo aluno
          </button>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
      )}
      {!isLoading && !error && students.length === 0 && (
        <EmptyState
          title="Nenhum aluno cadastrado"
          description="Busque alunos existentes ou cadastre um novo aluno nesta turma"
          actionLabel="Buscar aluno"
          onAction={() => setShowAddModal(true)}
          icon={
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      )}
      {!isLoading && !error && students.length > 0 && (
        <div className="space-y-3">
          {students.map((student) => (
            <StudentCard key={student.id} student={student}
              onEdit={(s) => setEditingStudent(s)}
              onRemove={(s) => setRemovingStudent(s)}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddStudentModal
          classId={classId}
          enrolledStudentIds={students.map((s) => s.id)}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { refetch(); setShowAddModal(false); }}
        />
      )}
      {showNewModal && (
        <StudentFormModal classId={classId}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => { refetch(); setShowNewModal(false); }}
        />
      )}
      {editingStudent && (
        <StudentFormModal classId={classId} student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={() => { refetch(); setEditingStudent(null); }}
        />
      )}
      {removingStudent && (
        <ConfirmRemoveModal classId={classId} student={removingStudent}
          onClose={() => setRemovingStudent(null)}
          onSuccess={() => { refetch(); setRemovingStudent(null); }}
        />
      )}
    </>
  );
};

// ─── Aba: Faltas ─────────────────────────────────────────────────────────────
interface AbsencesTabProps {
  classId: number;
  students: Student[];
}

const AbsencesTab = ({ classId, students }: AbsencesTabProps) => {
  const { absences, isLoading, error, refetch } = useAbsences(classId);
  const [showModal, setShowModal] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeError, setRemoveError] = useState('');

  const handleRemove = async (absenceId: number) => {
    setRemovingId(absenceId);
    setRemoveError('');
    try {
      await absenceService.remove(classId, absenceId);
      refetch();
    } catch (err: any) {
      setRemoveError(err.response?.data?.message || 'Erro ao remover falta.');
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const absencesByStudent = students
    .map((student) => ({ student, absences: absences.filter((a) => a.studentId === student.id) }))
    .filter((entry) => entry.absences.length > 0);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Faltas</h2>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {absences.length} {absences.length === 1 ? 'falta registrada' : 'faltas registradas'}
            </p>
          )}
        </div>
        <button onClick={() => setShowModal(true)} disabled={students.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Falta
        </button>
      </div>

      {removeError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{removeError}</div>
      )}
      {isLoading && <LoadingSpinner />}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
      )}
      {!isLoading && !error && absences.length === 0 && (
        <EmptyState
          title="Nenhuma falta registrada"
          description="Registre faltas dos alunos desta turma"
          actionLabel="Registrar Falta"
          onAction={() => setShowModal(true)}
          icon={
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      )}
      {!isLoading && !error && absencesByStudent.length > 0 && (
        <div className="space-y-4">
          {absencesByStudent.map(({ student, absences: studentAbsences }) => (
            <div key={student.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {student.person.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{student.person.name}</span>
                </div>
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                  {studentAbsences.length} {studentAbsences.length === 1 ? 'falta' : 'faltas'}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {studentAbsences.map((absence) => (
                  <div key={absence.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(absence.date)}</p>
                        {absence.reason && <p className="text-xs text-gray-500">{absence.reason}</p>}
                      </div>
                    </div>
                    <button onClick={() => handleRemove(absence.id)} disabled={removingId === absence.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Remover falta">
                      {removingId === absence.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AbsenceModal classId={classId} students={students}
          onClose={() => setShowModal(false)} onSuccess={refetch} />
      )}
    </>
  );
};

// ─── Aba: Atividades ─────────────────────────────────────────────────────────
interface ActivitiesTabProps {
  classId: number;
}

const ActivitiesTab = ({ classId }: ActivitiesTabProps) => {
  const { activities, isLoading, error, refetch } = useActivities(classId);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [removingActivity, setRemovingActivity] = useState<Activity | null>(null);

  const formatDate = (date?: string) =>
    date ? new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

  const isPast = (date?: string) => (date ? new Date(date) < new Date() : false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Atividades</h2>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {activities.length} {activities.length === 1 ? 'atividade cadastrada' : 'atividades cadastradas'}
            </p>
          )}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Atividade
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
      )}
      {!isLoading && !error && activities.length === 0 && (
        <EmptyState
          title="Nenhuma atividade cadastrada"
          description="Crie atividades para organizar o conteúdo desta turma"
          actionLabel="Nova Atividade"
          onAction={() => setShowModal(true)}
          icon={
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
      )}
      {!isLoading && !error && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((activity) => {
            const due = formatDate(activity.dueDate);
            const overdue = isPast(activity.dueDate);
            return (
              <div key={activity.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 leading-tight truncate">{activity.title}</p>
                    {activity.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
                    )}
                    {due && (
                      <div className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${overdue ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {overdue ? 'Venceu em ' : 'Entrega: '}{due}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                  <button onClick={() => setEditingActivity(activity)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Editar atividade">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => setRemovingActivity(activity)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remover atividade">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ActivityModal classId={classId} onClose={() => setShowModal(false)} onSuccess={refetch} />
      )}
      {editingActivity && (
        <ActivityModal classId={classId} activity={editingActivity}
          onClose={() => setEditingActivity(null)}
          onSuccess={() => { refetch(); setEditingActivity(null); }}
        />
      )}
      {removingActivity && (
        <ConfirmRemoveActivity classId={classId} activity={removingActivity}
          onClose={() => setRemovingActivity(null)}
          onSuccess={() => { refetch(); setRemovingActivity(null); }}
        />
      )}
    </>
  );
};

// ─── Página Principal ────────────────────────────────────────────────────────
export const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classId = Number(id);

  const { classes } = useClasses();
  const { students, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(classId);

  const [activeTab, setActiveTab] = useState<Tab>('students');

  const classesArray = Array.isArray(classes) ? classes : [];
  const currentClass = classesArray.find((c) => c.id === classId);

  const tabs: { key: Tab; label: string; count?: number; color: string }[] = [
    { key: 'students', label: 'Alunos', count: students.length, color: 'blue' },
    { key: 'absences', label: 'Faltas', color: 'orange' },
    { key: 'activities', label: 'Atividades', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentClass?.name || `Turma #${id}`}</h1>
                {currentClass?.schedule && <p className="text-xs text-gray-500">{currentClass.schedule}</p>}
              </div>
            </div>
            {currentClass && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentClass.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {currentClass.isActive ? 'Ativa' : 'Inativa'}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const colorMap: Record<string, string> = {
                blue: 'text-blue-600 border-blue-600',
                orange: 'text-orange-500 border-orange-500',
                purple: 'text-purple-600 border-purple-600',
              };
              const badgeMap: Record<string, string> = {
                blue: 'bg-blue-100 text-blue-700',
                orange: 'bg-orange-100 text-orange-700',
                purple: 'bg-purple-100 text-purple-700',
              };
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-4 px-2 mr-6 text-sm font-medium border-b-2 transition-colors ${isActive ? `${colorMap[tab.color]}` : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${isActive ? badgeMap[tab.color] : 'bg-gray-100 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {activeTab === 'students' && (
              <StudentsTab classId={classId} students={students}
                isLoading={studentsLoading} error={studentsError} refetch={refetchStudents} />
            )}
            {activeTab === 'absences' && (
              <AbsencesTab classId={classId} students={students} />
            )}
            {activeTab === 'activities' && (
              <ActivitiesTab classId={classId} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
