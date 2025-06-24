// Servicio para productos

import { apiService } from './api';
import type { Producto } from '../types';

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await apiService.get<Producto[]>('/productos');
    return response;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiService.get<Producto>(`/productos/${id}`);
    return response;
  },

  create: async (producto: Omit<Producto, 'producto_id' | 'fecha_creacion' | 'updated_at' | 'activo' | 'categoria'>): Promise<Producto> => {
    const response = await apiService.post<Producto>('/productos', producto);
    return response;
  },

  update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const response = await apiService.patch<Producto>(`/productos/${id}`, producto);
    return response;
  },

  delete: async (id: number): Promise<{ msj: string }> => {
    const response = await apiService.delete<{ msj: string }>(`/productos/${id}`);
    return response;
  },
};


