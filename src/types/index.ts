// Tipos TypeScript para la aplicación de tienda

export interface Usuario {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  contraseña: string;
  rol: 'admin' | 'vendedor' | 'cliente';
  fecha_creacion: string;
}

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  updated_at: string;
}

export interface Producto {
  producto_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  codigo_barra?: string;
  fecha_creacion: string;
  categoria_id: number;
  categoria?: Categoria;
  imagen_url?: string;
  activo?: boolean;
  updated_at?: string;
}

export interface Cliente {
  cliente_id: number;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_creacion: string;
}

export interface Venta {
  venta_id: number;
  usuario_id?: number;
  cliente_id?: number;
  fecha: string;
  total: number;
  usuario?: Usuario;
  cliente?: Cliente;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  detalle_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Inventario {
  id: number;
  producto_id: number;
  producto?: Producto;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  ubicacion?: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  ventasHoy: number;
  ventasMes: number;
  productosActivos: number;
  clientesActivos: number;
  productosStockBajo: number;
  ventasRecientes: Venta[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}


// Tipos específicos para el módulo de ventas
export interface VentaDetalle {
  detalle_id?: number;
  venta_id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  producto?: Producto;
}

export interface VentaFormData {
  cliente_id?: number;
  productos: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

// Tipos para el carrito de ventas
export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface ProcesarVentaRequest {
  cliente_id?: number;
  total: number;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }[];
}

