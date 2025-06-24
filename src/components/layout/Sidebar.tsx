// Sidebar de navegación

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Warehouse,
  Tags,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { authService } from '@/services/auth';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Productos', href: ROUTES.PRODUCTOS, icon: Package },
  { name: 'Categorías', href: ROUTES.CATEGORIAS, icon: Tags },
  { name: 'Clientes', href: ROUTES.CLIENTES, icon: Users },
  { name: 'Ventas', href: ROUTES.VENTAS, icon: ShoppingCart },
  { name: 'Inventario', href: ROUTES.INVENTARIO, icon: Warehouse },
  { name: 'Reportes', href: ROUTES.REPORTES, icon: BarChart3 },
  { name: 'Usuarios', href: ROUTES.USUARIOS, icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Store className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">
          Tienda Online
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentUser?.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.nombre}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser?.rol}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

