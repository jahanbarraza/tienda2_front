// Página de gestión de productos con CRUD completo

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Filter,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '@/utils';
import { productoService } from '@/services/producto';
import { ProductoForm } from '@/components/forms/ProductoForm';
import type { Producto, Categoria } from '@/types';

export const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deletingProducto, setDeletingProducto] = useState<Producto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productoService.getAll(),
        // Simulamos categorías por ahora
        Promise.resolve([
          { categoria_id: 1, nombre: 'Electrónicos', descripcion: '', activo: true, fecha_creacion: '', updated_at: '' },
          { categoria_id: 2, nombre: 'Ropa', descripcion: '', activo: true, fecha_creacion: '', updated_at: '' },
          { categoria_id: 3, nombre: 'Hogar', descripcion: '', activo: true, fecha_creacion: '', updated_at: '' }
        ] as Categoria[])
      ]);
      
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProducto = async (productoData: Omit<Producto, 'producto_id' | 'fecha_creacion' | 'updated_at' | 'activo' | 'categoria'>) => {
    try {
      await productoService.create(productoData);
      await loadData(); // Recargar datos
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  };

  const handleUpdateProducto = async (productoData: Omit<Producto, 'producto_id' | 'fecha_creacion' | 'updated_at' | 'activo' | 'categoria'>) => {
    if (!editingProducto) return;
    
    try {
      await productoService.update(editingProducto.producto_id, productoData);
      await loadData(); // Recargar datos
      setEditingProducto(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  };

  const handleDeleteProducto = async (producto: Producto) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}"?`)) {
      return;
    }

    try {
      await productoService.delete(producto.producto_id);
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const openCreateForm = () => {
    setEditingProducto(null);
    setIsFormOpen(true);
  };

  const openEditForm = (producto: Producto) => {
    setEditingProducto(producto);
    setIsFormOpen(true);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo_barra?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600">Gestiona tu catálogo de productos</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona tu catálogo de productos</p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => {
          const stockStatus = getStockStatus(producto.stock_actual || 0, 10);
          const categoria = categorias.find(c => c.categoria_id === producto.categoria_id);
          
          return (
            <Card key={producto.producto_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                      <CardDescription className="text-sm">
                        {producto.codigo_barra || 'Sin código'}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {producto.descripcion || 'Sin descripción'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(producto.precio)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {categoria?.nombre || 'Sin categoría'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </p>
                    <p className="text-xs text-gray-500">{producto.stock_actual || 0} unidades</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditForm(producto)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProducto(producto)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProductos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron productos con ese criterio de búsqueda.' : 'Comienza agregando tu primer producto.'}
          </p>
          <div className="mt-6">
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>
      )}

      {/* Formulario de producto */}
      <ProductoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProducto(null);
        }}
        onSave={editingProducto ? handleUpdateProducto : handleCreateProducto}
        producto={editingProducto}
        categorias={categorias}
      />
    </div>
  );
};

