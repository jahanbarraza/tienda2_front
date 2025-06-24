// Servicio para categorías

import { apiService } from './api';
import type { Categoria } from '../types';

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await apiService.get<Categoria[]>('/categorias');
    return response;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await apiService.get<Categoria>(`/categorias/${id}`);
    return response;
  },

  create: async (categoria: Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'updated_at' | 'activo'>): Promise<Categoria> => {
    const response = await apiService.post<Categoria>('/categorias', categoria);
    return response;
  },

  update: async (id: number, categoria: Partial<Categoria>): Promise<Categoria> => {
    const response = await apiService.patch<Categoria>(`/categorias/${id}`, categoria);
    return response;
  },

  delete: async (id: number): Promise<{ msj: string }> => {
    const response = await apiService.delete<string>(`/categorias/${id}`);
    return response;
  },
};


