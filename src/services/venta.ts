// Servicio para ventas

import { apiService } from './api';
import { Venta, VentaDetalle } from '@/types';

export const ventaService = {
  // Obtener todas las ventas
  getAll: async (): Promise<Venta[]> => {
    const response = await apiService.get('/ventas');
    return response.data;
  },

  // Obtener una venta por ID
  getById: async (id: number): Promise<Venta> => {
    const response = await apiService.get(`/ventas/${id}`);
    return response.data;
  },

  // Crear una nueva venta
  create: async (venta: Omit<Venta, 'venta_id' | 'fecha_venta'>): Promise<Venta> => {
    const response = await apiService.post('/ventas', venta);
    return response.data;
  },

  // Actualizar una venta
  update: async (id: number, venta: Partial<Venta>): Promise<Venta> => {
    const response = await apiService.patch(`/ventas/${id}`, venta);
    return response.data;
  },

  // Eliminar una venta
  delete: async (id: number): Promise<{ msj: string }> => {
    const response = await apiService.delete(`/ventas/${id}`);
    return response.data;
  },

  // Procesar una venta completa (con detalles)
  procesarVenta: async (ventaData: {
    cliente_id?: number;
    total: number;
    detalles: VentaDetalle[];
  }): Promise<Venta> => {
    const response = await apiService.post('/ventas', ventaData);
    return response.data;
  }
};

