// Página de Dashboard

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  AlertTriangle,
  DollarSign 
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import type { DashboardStats } from '@/types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    ventasHoy: 0,
    ventasMes: 0,
    productosActivos: 0,
    clientesActivos: 0,
    productosStockBajo: 0,
    ventasRecientes: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        ventasHoy: 1250000,
        ventasMes: 25000000,
        productosActivos: 145,
        clientesActivos: 89,
        productosStockBajo: 12,
        ventasRecientes: [],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: 'Ventas Hoy',
      value: formatCurrency(stats.ventasHoy),
      description: '+12% vs ayer',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(stats.ventasMes),
      description: '+8% vs mes anterior',
      icon: TrendingUp,
      trend: 'up',
    },
    {
      title: 'Productos Activos',
      value: stats.productosActivos.toString(),
      description: '5 nuevos esta semana',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Clientes Activos',
      value: stats.clientesActivos.toString(),
      description: '3 nuevos hoy',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Productos Stock Bajo',
      value: stats.productosStockBajo.toString(),
      description: 'Requieren atención',
      icon: AlertTriangle,
      trend: 'warning',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general de tu tienda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu tienda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'warning' ? 'text-yellow-600' : 'text-gray-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'warning' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Últimas transacciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Venta #{1000 + i}</p>
                      <p className="text-xs text-gray-500">Cliente {i + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(150000 + (i * 25000))}</p>
                    <p className="text-xs text-gray-500">Hace {i + 1}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Stock Bajo</CardTitle>
            <CardDescription>
              Productos que requieren reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Producto {i + 1}</p>
                      <p className="text-xs text-gray-500">SKU-{1000 + i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{2 + i} unidades</p>
                    <p className="text-xs text-gray-500">Min: {10 + i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

