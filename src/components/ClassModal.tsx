import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { classService } from '../services/classService';
import type { Class } from '../types/class';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classData?: Class | null;
}

export const ClassModal = ({ isOpen, onClose, onSuccess, classData }: ClassModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        description: classData.description || '',
        schedule: classData.schedule || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        schedule: '',
      });
    }
  }, [classData, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (classData) {
        // Atualizar turma existente
        await classService.update(classData.id, formData);
      } else {
        // Criar nova turma
        await classService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar turma:', err);
      setError(err.response?.data?.message || 'Erro ao salvar turma');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classData) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a turma "${classData.name}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await classService.delete(classData.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao excluir turma:', err);
      setError(err.response?.data?.message || 'Erro ao excluir turma');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classData ? 'Editar Turma' : 'Nova Turma'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Turma"
          type="text"
          placeholder="Ex: Turma Backend 2026"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Descrição da turma..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Input
          label="Horário"
          type="text"
          placeholder="Ex: Segunda e Quarta - 19:00 às 21:00"
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {classData && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-300"
            >
              Excluir
            </button>
          )}
          
          <div className="flex-1 flex gap-3">
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
              {classData ? 'Salvar' : 'Criar Turma'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
