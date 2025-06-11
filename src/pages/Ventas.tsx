// Página de gestión de ventas - Realizar Venta

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Minus, ShoppingCart, Search, X, DollarSign, Package, Users } from 'lucide-react';
import { Producto, CarritoItem, Cliente } from '@/types';
import { productoService } from '@/services/producto';
import { ventaService } from '@/services/venta';

export function Ventas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | undefined>();
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
    cargarClientes();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarClientes = async () => {
    try {
      // Simulamos clientes por ahora ya que no hay endpoint específico
      const clientesSimulados: Cliente[] = [
        { cliente_id: 1, nombre: 'Cliente General', email: 'general@tienda.com', telefono: '123456789', direccion: 'Dirección General', fecha_creacion: new Date().toISOString() },
        { cliente_id: 2, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '987654321', direccion: 'Calle 123', fecha_creacion: new Date().toISOString() },
        { cliente_id: 3, nombre: 'María García', email: 'maria@email.com', telefono: '456789123', direccion: 'Avenida 456', fecha_creacion: new Date().toISOString() }
      ];
      setClientes(clientesSimulados);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    producto.codigo_barra?.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.producto_id === producto.producto_id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.producto.producto_id === producto.producto_id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * parseFloat(producto.precio.toString()) }
            : item
        ));
      }
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        subtotal: parseFloat(producto.precio.toString())
      }]);
    }
  };

  const actualizarCantidad = (productoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const producto = productos.find(p => p.producto_id === productoId);
    if (producto && nuevaCantidad <= producto.stock) {
      setCarrito(carrito.map(item =>
        item.producto.producto_id === productoId
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * parseFloat(producto.precio.toString()) }
          : item
      ));
    }
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter(item => item.producto.producto_id !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) return;

    setLoading(true);
    try {
      // Obtener el usuario actual del localStorage
      const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      const usuario_id = authUser.id || 1; // Fallback a ID 1 si no hay usuario

      const ventaData = {
        cliente_id: clienteSeleccionado,
        usuario_id: usuario_id,
        total: calcularTotal(),
        detalles: carrito.map(item => ({
          producto_id: item.producto.producto_id,
          cantidad: item.cantidad,
          precio_unitario: parseFloat(item.producto.precio.toString()),
          subtotal: item.subtotal
        }))
      };

      await ventaService.procesarVenta(ventaData);
      
      // Limpiar carrito y resetear formulario
      setCarrito([]);
      setClienteSeleccionado(undefined);
      setShowConfirmDialog(false);
      
      // Recargar productos para actualizar stock
      await cargarProductos();
      
      alert('Venta procesada exitosamente');
    } catch (error) {
      console.error('Error al procesar venta:', error);
      alert('Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Realizar Venta</h1>
          <p className="text-gray-600 mt-2">Gestiona las ventas de productos</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {carrito.length} productos
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <DollarSign className="w-4 h-4 mr-2" />
            ${calcularTotal().toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de productos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Productos Disponibles
              </CardTitle>
              <CardDescription>
                Selecciona productos para agregar a la venta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos por nombre o código..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {productosFiltrados.map((producto) => (
                  <Card key={producto.producto_id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{producto.nombre}</h3>
                        <Badge variant={producto.stock > 10 ? "default" : producto.stock > 0 ? "secondary" : "destructive"}>
                          Stock: {producto.stock}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{producto.descripcion}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ${parseFloat(producto.precio.toString()).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => agregarAlCarrito(producto)}
                          disabled={producto.stock === 0}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel del carrito */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrito de Venta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="cliente">Cliente (Opcional)</Label>
                <Select value={clienteSeleccionado?.toString()} onValueChange={(value) => setClienteSeleccionado(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.cliente_id} value={cliente.cliente_id.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {carrito.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">El carrito está vacío</p>
                ) : (
                  carrito.map((item) => (
                    <div key={item.producto.producto_id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.producto.nombre}</p>
                        <p className="text-xs text-gray-600">${parseFloat(item.producto.precio.toString()).toLocaleString()} c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.producto.producto_id, item.cantidad - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.producto.producto_id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => eliminarDelCarrito(item.producto.producto_id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {carrito.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${calcularTotal().toLocaleString()}
                    </span>
                  </div>

                  <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Procesar Venta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Venta</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas procesar esta venta?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Resumen de la venta:</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Cant.</TableHead>
                                <TableHead>Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {carrito.map((item) => (
                                <TableRow key={item.producto.producto_id}>
                                  <TableCell>{item.producto.nombre}</TableCell>
                                  <TableCell>{item.cantidad}</TableCell>
                                  <TableCell>${item.subtotal.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="font-semibold">Total:</span>
                            <span className="text-xl font-bold text-green-600">
                              ${calcularTotal().toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={procesarVenta}
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading ? 'Procesando...' : 'Confirmar Venta'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

