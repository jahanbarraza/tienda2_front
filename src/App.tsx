// Aplicación principal con enrutamiento

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Productos } from '@/pages/Productos';
import { Login } from '@/pages/Login';
import { Categorias } from '@/pages/Categorias';
import { Ventas } from '@/pages/Ventas';
import Inventario from '@/pages/Inventario';
import { authService } from '@/services/auth';
import { ROUTES } from '@/constants';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
};

// Componente para rutas públicas (solo accesibles si no está autenticado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path={ROUTES.LOGIN} 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PRODUCTOS} element={<Productos />} />
          <Route path={ROUTES.CATEGORIAS} element={<Categorias />} />
          <Route path={ROUTES.VENTAS} element={<Ventas />} />
          {/* Páginas placeholder para otras rutas */}
          <Route 
            path={ROUTES.CLIENTES} 
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold">Clientes</h1>
                <p className="text-gray-600 mt-2">Gestión de clientes - En desarrollo</p>
              </div>
            } 
          />
          <Route 
            path={ROUTES.CLIENTES} 
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold">Clientes</h1>
                <p className="text-gray-600 mt-2">Gestión de clientes - En desarrollo</p>
              </div>
            } 
          />
          <Route 
            path={ROUTES.INVENTARIO} 
            element={<Inventario />} 
          />
          <Route 
            path={ROUTES.REPORTES} 
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold">Reportes</h1>
                <p className="text-gray-600 mt-2">Reportes y estadísticas - En desarrollo</p>
              </div>
            } 
          />
          <Route 
            path={ROUTES.USUARIOS} 
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold">Usuarios</h1>
                <p className="text-gray-600 mt-2">Gestión de usuarios - En desarrollo</p>
              </div>
            } 
          />
        </Route>
        
        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="text-gray-600 mt-2">Página no encontrada</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

