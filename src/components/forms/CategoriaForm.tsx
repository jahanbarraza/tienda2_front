// Componente para crear/editar categorías

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Save, Loader2 } from 'lucide-react';
import type { Categoria } from '@/types';

interface CategoriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoria: Omit<Categoria, 'categoria_id' | 'fecha_creacion' | 'updated_at' | 'activo'>) => Promise<void>;
  categoria?: Categoria | null;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
  isOpen,
  onClose,
  onSave,
  categoria
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
    setErrors({});
  }, [categoria, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
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
        descripcion: formData.descripcion.trim() || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
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
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {categoria 
              ? 'Modifica los datos de la categoría seleccionada.' 
              : 'Completa la información para crear una nueva categoría.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Nombre de la categoría"
              className={errors.nombre ? 'border-red-500' : ''}
              maxLength={100}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción de la categoría (opcional)"
              rows={4}
              maxLength={500}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            <div className="flex justify-between items-center">
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.descripcion.length}/500 caracteres
              </p>
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
              {categoria ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

