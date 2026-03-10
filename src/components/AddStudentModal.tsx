import { useState } from 'react';
import { useTeacherStudents } from '../hooks/useTeacherStudents';
import { studentService } from '../services/studentService';
import type { StudentCreate, StudentSummary } from '../services/studentService';

type Tab = 'search' | 'new';

interface AddStudentModalProps {
  classId: number;
  /** IDs dos alunos que já estão na turma (para marcar como já adicionados) */
  enrolledStudentIds?: number[];
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Aba: Buscar aluno existente ─────────────────────────────────────────────
const SearchTab = ({
  classId,
  enrolledStudentIds,
  onSuccess,
}: {
  classId: number;
  enrolledStudentIds: number[];
  onSuccess: () => void;
}) => {
  const { students, isLoading, error, search, setSearch } = useTeacherStudents();
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollError, setEnrollError] = useState('');

  const handleEnroll = async (student: StudentSummary) => {
    setEnrollingId(student.id);
    setEnrollError('');
    try {
      await studentService.enrollExisting(classId, student.id);
      onSuccess();
    } catch (err: any) {
      setEnrollError(err.response?.data?.message || 'Erro ao adicionar aluno à turma.');
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (id: number) => enrolledStudentIds.includes(id);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {enrollError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{enrollError}</div>
      )}

      <div className="overflow-y-auto max-h-72 flex flex-col gap-2 pr-1">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !isLoading && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {!isLoading && !error && students.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              {search ? 'Nenhum aluno encontrado.' : 'Digite para buscar alunos.'}
            </p>
          </div>
        )}

        {(students as StudentSummary[]).map((student) => {
          const already = isEnrolled(student.id);
          return (
            <div key={student.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {student.person.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{student.person.name}</p>
                  <p className="text-xs text-gray-500">{student.person.email}</p>
                </div>
              </div>
              {already ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex-shrink-0">Já na turma</span>
              ) : (
                <button
                  onClick={() => handleEnroll(student)}
                  disabled={enrollingId === student.id}
                  className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {enrollingId === student.id ? 'Adicionando...' : 'Adicionar'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Aba: Cadastrar novo aluno ────────────────────────────────────────────────
const NewStudentTab = ({
  classId,
  onSuccess,
}: {
  classId: number;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState<StudentCreate>({ name: '', email: '', cpf: '', phone: '', birthDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await studentService.addToClass(classId, form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar aluno. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo <span className="text-red-500">*</span></label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="João da Silva"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail <span className="text-red-500">*</span></label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="joao@exemplo.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CPF <span className="text-red-500">*</span></label>
        <input type="text" required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          placeholder="000.000.000-00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(11) 99999-0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nascimento</label>
          <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm mt-1">
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar e adicionar à turma'}
      </button>
    </form>
  );
};

// ─── Modal principal ──────────────────────────────────────────────────────────
export const AddStudentModal = ({
  classId,
  enrolledStudentIds = [],
  onClose,
  onSuccess,
}: AddStudentModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Adicionar Aluno</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          <button onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Buscar existente
          </button>
          <button onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Novo aluno
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'search' ? (
            <SearchTab classId={classId} enrolledStudentIds={enrolledStudentIds} onSuccess={handleSuccess} />
          ) : (
            <NewStudentTab classId={classId} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
