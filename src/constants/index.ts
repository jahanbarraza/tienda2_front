// Constantes de la aplicación

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTOS: '/productos',
  CATEGORIAS: '/categorias',
  CLIENTES: '/clientes',
  VENTAS: '/ventas',
  INVENTARIO: '/inventario',
  USUARIOS: '/usuarios',
  REPORTES: '/reportes',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  GERENTE: 'gerente',
} as const;

export const VENTA_ESTADOS = {
  PENDIENTE: 'pendiente',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;

export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  TRANSFERENCIA: 'transferencia',
} as const;

export const TIPOS_DOCUMENTO = {
  CEDULA: 'cedula',
  NIT: 'nit',
  PASAPORTE: 'pasaporte',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;



