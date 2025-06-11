// Utilidades generales

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-()]{7,15}$/;
  return phoneRegex.test(phone);
};

export const generateSKU = (): string => {
  return 'SKU-' + Date.now().toString(36).toUpperCase();
};

export const calculateSubtotal = (precio: number, cantidad: number): number => {
  return precio * cantidad;
};

export const calculateTotal = (subtotal: number, descuento: number = 0, impuestos: number = 0): number => {
  return subtotal - descuento + impuestos;
};

export const getInitials = (nombre: string): string => {
  return nombre
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isStockLow = (stockActual: number, stockMinimo: number): boolean => {
  return stockActual <= stockMinimo;
};

export const getStockStatus = (stockActual: number, stockMinimo: number): {
  status: 'high' | 'medium' | 'low' | 'out';
  color: string;
  text: string;
} => {
  if (stockActual === 0) {
    return { status: 'out', color: 'text-red-600', text: 'Agotado' };
  }
  if (stockActual <= stockMinimo) {
    return { status: 'low', color: 'text-red-500', text: 'Stock Bajo' };
  }
  if (stockActual <= stockMinimo * 2) {
    return { status: 'medium', color: 'text-yellow-500', text: 'Stock Medio' };
  }
  return { status: 'high', color: 'text-green-500', text: 'Stock Alto' };
};

// Función para manejar errores de API
export const handleApiError = (error: any): void => {
  console.error('Error en la solicitud API:', error);
  // Aquí se podría implementar lógica adicional como mostrar notificaciones
  // o registrar errores en un servicio de monitoreo
};
