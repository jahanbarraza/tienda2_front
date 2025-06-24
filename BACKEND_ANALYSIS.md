// Análisis del Backend - Tienda2

## Estructura del Backend
El backend es una API REST con Node.js, Express y PostgreSQL que maneja:

### Entidades principales:
1. **Usuarios** - Sistema de autenticación y roles
2. **Categorías** - Clasificación de productos
3. **Productos** - Catálogo de productos
4. **Clientes** - Gestión de clientes
5. **Ventas** - Registro de ventas
6. **Detalle_venta** - Items específicos de cada venta
7. **Inventario** - Control de stock

### Funcionalidades identificadas:
- CRUD completo para todas las entidades
- Sistema de autenticación
- Gestión de inventario
- Procesamiento de ventas
- Reportes y consultas

### API Endpoints (estimados):
- `/api/v1/usuarios` - Gestión de usuarios
- `/api/v1/categorias` - Gestión de categorías
- `/api/v1/productos` - Gestión de productos
- `/api/v1/clientes` - Gestión de clientes
- `/api/v1/ventas` - Gestión de ventas
- `/api/v1/detalle_venta` - Detalles de ventas
- `/api/v1/inventario` - Control de inventario

## Funcionalidades requeridas para el Frontend:
1. Dashboard principal con métricas
2. Gestión de productos (CRUD)
3. Gestión de categorías
4. Gestión de clientes
5. Sistema de ventas/POS
6. Control de inventario
7. Reportes y estadísticas
8. Sistema de autenticación

