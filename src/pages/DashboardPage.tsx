import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useClasses } from '../hooks/useClasses';
import { StatsCard } from '../components/StatsCard';
import { ClassCard } from '../components/ClassCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ClassModal } from '../components/ClassModal';
import { AddStudentModal } from '../components/AddStudentModal';
import type { Class } from '../types/class';

export const DashboardPage = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const { classes, isLoading: classesLoading, error, refetch } = useClasses();
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleNewClass = () => {
    setSelectedClass(null);
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setSelectedClass(classData);
    setIsClassModalOpen(true);
  };

  const handleAddStudent = (classData: Class) => {
    setSelectedClass(classData);
    setIsAddStudentModalOpen(true);
  };

  const handleClassSuccess = () => {
    refetch(); // Recarrega a lista de turmas
    setIsClassModalOpen(false);
    setSelectedClass(null);
  };

  const handleStudentSuccess = () => {
    refetch(); // Recarrega a lista de turmas
    setIsAddStudentModalOpen(false);
    setSelectedClass(null);
  };

  // Calcula estatísticas - verifica se classes é um array
  console.log('🔍 Classes do hook:', classes);
  console.log('🔍 É array?', Array.isArray(classes));
  console.log('🔍 Length:', classes?.length);
  
  const classesArray = Array.isArray(classes) ? classes : [];
  
  console.log('📊 Classes Array:', classesArray);
  console.log('📊 Total:', classesArray.length);
  
  const totalClasses = classesArray.length;
  const totalStudents = classesArray.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const recentClass = classesArray.length > 0 
    ? [...classesArray].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;
  
  console.log('📊 Total de turmas:', totalClasses);
  console.log('📊 Total de alunos:', totalStudents);
  console.log('📊 Turma mais recente:', recentClass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Coach Track</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.person.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.person.name?.split(' ')[0] || 'Professor'}! ⚽
          </h2>
          <p className="text-gray-600">
            Gerencie suas turmas e acompanhe o desenvolvimento dos seus atletas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total de Turmas"
            value={classesLoading ? '-' : totalClasses}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatsCard
            title="Total de Alunos"
            value={classesLoading ? '-' : totalStudents}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Turma Mais Recente"
            value={classesLoading ? '-' : (recentClass?.name || 'Nenhuma')}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Minhas Turmas</h3>
            <button
              onClick={handleNewClass}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Turma
            </button>
          </div>

          {/* Loading State */}
          {classesLoading && <LoadingSpinner />}

          {/* Error State */}
          {error && !classesLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Erro ao carregar turmas</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!classesLoading && !error && classesArray.length === 0 && (
            <EmptyState
              title="Nenhuma turma cadastrada"
              description="Comece criando sua primeira turma para gerenciar seus atletas"
              actionLabel="Criar Primeira Turma"
              onAction={handleNewClass}
              icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          )}

          {/* Classes Grid */}
          {!classesLoading && !error && classesArray.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classesArray.map((classData) => (
                <ClassCard 
                  key={classData.id} 
                  classData={classData}
                  onEdit={handleEditClass}
                  onAddStudent={handleAddStudent}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setSelectedClass(null);
        }}
        onSuccess={handleClassSuccess}
        classData={selectedClass}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => {
          setIsAddStudentModalOpen(false);
          setSelectedClass(null);
        }}
        onSuccess={handleStudentSuccess}
        classId={selectedClass?.id}
        className={selectedClass?.name}
      />
    </div>
  );
};
