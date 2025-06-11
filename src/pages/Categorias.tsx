// Página de gestión de categorías con CRUD completo

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
  Tag,
  Filter,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { categoriaService } from '@/services/categoria';
import { CategoriaForm } from '@/components/forms/CategoriaForm';
import type { Categoria } from '@/types';

export const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const categoriasData = await categoriaService.getAll();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategoria = async (categoriaData: Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'updated_at' | 'activo'>) => {
    try {
      await categoriaService.create(categoriaData);
      await loadCategorias(); // Recargar datos
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  };

  const handleUpdateCategoria = async (categoriaData: Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'updated_at' | 'activo'>) => {
    if (!editingCategoria) return;
    
    try {
      await categoriaService.update(editingCategoria.categoria_id, categoriaData);
      await loadCategorias(); // Recargar datos
      setEditingCategoria(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  };

  const handleDeleteCategoria = async (categoria: Categoria) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      await categoriaService.delete(categoria.categoria_id);
      await loadCategorias(); // Recargar datos
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const openCreateForm = () => {
    setEditingCategoria(null);
    setIsFormOpen(true);
  };

  const openEditForm = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsFormOpen(true);
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600">Gestiona las categorías de productos</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de productos</p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Categoría</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar categorías por nombre o descripción..."
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategorias.map((categoria) => (
          <Card key={categoria.categoria_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <CardTitle className="text-lg">{categoria.nombre}</CardTitle>
                    <CardDescription className="text-sm">
                      {categoria.descripcion || 'Sin descripción'}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge 
                    variant={categoria.activo ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {categoria.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Creada: {new Date(categoria.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditForm(categoria)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteCategoria(categoria)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategorias.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron categorías con ese criterio de búsqueda.' : 'Comienza agregando tu primera categoría.'}
          </p>
          <div className="mt-6">
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </div>
      )}

      {/* Formulario de categoría */}
      <CategoriaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategoria(null);
        }}
        onSave={editingCategoria ? handleUpdateCategoria : handleCreateCategoria}
        categoria={editingCategoria}
      />
    </div>
  );
};

