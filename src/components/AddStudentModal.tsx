import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { studentService } from '../services/studentService';
import type { StudentCreate } from '../services/studentService';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId?: number;
  className?: string;
}

export const AddStudentModal = ({ isOpen, onClose, onSuccess, classId, className }: AddStudentModalProps) => {
  const [formData, setFormData] = useState<StudentCreate>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!classId) {
      setError('ID da turma não encontrado');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      await studentService.addToClass(classId, formData);
      onSuccess();
      onClose();
      // Limpa o formulário
      setFormData({
        name: '',
        email: '',
        cpf: '',
        phone: '',
        birthDate: '',
      });
    } catch (err: any) {
      console.error('Erro ao adicionar aluno:', err);
      setError(err.response?.data?.message || 'Erro ao adicionar aluno');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={className ? `Adicionar Aluno - ${className}` : 'Adicionar Aluno'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          type="text"
          placeholder="Ex: João Silva"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="joao@exemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="CPF"
          type="text"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          required
        />

        <Input
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Data de Nascimento"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-100"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            Adicionar Aluno
          </Button>
        </div>
      </form>
    </Modal>
  );
};
