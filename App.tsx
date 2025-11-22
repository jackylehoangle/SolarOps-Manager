import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
import Business from './components/Business';
import HR from './components/HR';
import Finance from './components/Finance';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Department } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedDepts?: Department[] }> = ({ children, allowedDepts }) => {
  const { user, isLoading, checkAccess } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific departments are required, check access
  if (allowedDepts && !checkAccess(allowedDepts)) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Truy cập bị từ chối</h2>
          <p className="text-slate-600 mt-2">Bạn không có quyền truy cập vào trang này.</p>
          <div className="mt-4 text-sm text-slate-500">
             Yêu cầu: {allowedDepts.join(', ')} <br/>
             Hiện tại: {user.department} ({user.level})
          </div>
          <a href="/" className="inline-block mt-4 text-emerald-600 hover:underline">Quay lại trang chủ</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard: Everyone can access */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Business: Board & Sales */}
          <Route path="/business" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.SALES]}>
              <Business />
            </ProtectedRoute>
          } />
          
          {/* Projects: Board, Sales, Technical */}
          <Route path="/projects" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.SALES, Department.TECHNICAL]}>
              <ProjectList />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.SALES, Department.TECHNICAL]}>
              <ProjectDetail />
            </ProtectedRoute>
          } />
          
          {/* Inventory: Board, Technical, Warehouse */}
          <Route path="/inventory" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.TECHNICAL, Department.WAREHOUSE]}>
              <Inventory />
            </ProtectedRoute>
          } />
          
          {/* HR: Everyone can access for Personal Attendance; Admin/HR sees full view */}
          <Route path="/hr" element={
            <ProtectedRoute>
              <HR />
            </ProtectedRoute>
          } />
          
          {/* Finance: Board, Finance */}
          <Route path="/finance" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.FINANCE]}>
              <Finance />
            </ProtectedRoute>
          } />
          
          {/* AI Assistant: Board, Technical, Sales */}
          <Route path="/assistant" element={
            <ProtectedRoute allowedDepts={[Department.BOARD, Department.TECHNICAL, Department.SALES]}>
              <AIAssistant />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;