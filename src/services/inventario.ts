import { API_BASE_URL } from '../constants';
import { handleApiError } from '../utils';

export interface MovimientoInventario {
  inventario_id?: number;
  producto_id: number;
  tipo_movimiento: 'entrada' | 'salida';
  cantidad: number;
  fecha?: string;
}

export interface ProductoInventario {
  producto_id: number;
  nombre: string;
  stock: number;
  codigo_barra?: string;
  categoria_id?: number;
  categoria_nombre?: string;
}

export const inventarioService = {
  // Obtener todos los movimientos de inventario
  async getMovimientos() {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/inventario`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Obtener movimientos de inventario por producto
  async getMovimientosPorProducto(productoId: number) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/inventario/producto/${productoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Registrar un nuevo movimiento de inventario
  async registrarMovimiento(movimiento: MovimientoInventario) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/inventario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movimiento)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Obtener productos con stock bajo
  async getProductosStockBajo(limite: number = 10) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/inventario/stock-bajo?limite=${limite}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Actualizar stock de un producto
  async actualizarStock(productoId: number, cantidad: number) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/inventario/producto/${productoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock: cantidad })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
