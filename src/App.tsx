import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewClassPage } from './pages/NewClassPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rota protegida - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Rota protegida - Nova Turma */}
        <Route
          path="/dashboard/new"
          element={
            <ProtectedRoute>
              <NewClassPage />
            </ProtectedRoute>
          }
        />

        {/* Rota protegida - Detalhes da Turma */}
        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute>
              <ClassDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Rota 404 - Comentada temporariamente */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
