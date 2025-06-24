// Componente para crear/editar productos

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Save, Loader2 } from 'lucide-react';
import type { Producto, Categoria } from '@/types';

interface ProductoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Omit<Producto, 'producto_id' | 'fecha_creacion' | 'updated_at' | 'activo' | 'categoria'>) => Promise<void>;
  producto?: Producto | null;
  categorias: Categoria[];
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  isOpen,
  onClose,
  onSave,
  producto,
  categorias
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    codigo_barra: '',
    categoria_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio.toString(),
        stock: producto.stock?.toString() || '0',
        codigo_barra: producto.codigo_barra || '',
        categoria_id: producto.categoria_id?.toString() || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        codigo_barra: '',
        categoria_id: ''
      });
    }
    setErrors({});
  }, [producto, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        codigo_barra: formData.codigo_barra.trim() || null,
        categoria_id: parseInt(formData.categoria_id)
      });
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {producto 
              ? 'Modifica los datos del producto seleccionado.' 
              : 'Completa la información para crear un nuevo producto.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Nombre del producto"
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_barra">Código de Barras</Label>
              <Input
                id="codigo_barra"
                value={formData.codigo_barra}
                onChange={(e) => handleInputChange('codigo_barra', e.target.value)}
                placeholder="Código de barras"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', e.target.value)}
                placeholder="0.00"
                className={errors.precio ? 'border-red-500' : ''}
              />
              {errors.precio && (
                <p className="text-sm text-red-500">{errors.precio}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => handleInputChange('categoria_id', value)}
              >
                <SelectTrigger className={errors.categoria_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.categoria_id} value={categoria.categoria_id.toString()}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria_id && (
                <p className="text-sm text-red-500">{errors.categoria_id}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {producto ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

