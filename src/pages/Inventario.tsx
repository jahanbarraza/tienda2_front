import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventarioService, MovimientoInventario, ProductoInventario } from '../services/inventario';
import { productoService } from '../services/producto';
import { MainLayout } from '../components/layout/MainLayout';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Package } from 'lucide-react';

const Inventario = () => {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [stockBajo, setStockBajo] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipoMovimiento, setTipoMovimiento] = useState<'entrada' | 'salida'>('entrada');
  const [busqueda, setBusqueda] = useState('');
  
  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos
        const productosData = await productoService.getAll();
        setProductos(productosData);
        
        // Cargar movimientos de inventario
        const movimientosData = await inventarioService.getMovimientos();
        setMovimientos(movimientosData);
        
        // Cargar productos con stock bajo
        const stockBajoData = await inventarioService.getProductosStockBajo();
        setStockBajo(stockBajoData);
        
        setError(null);
      } catch (err) {
        setError('Error al cargar datos de inventario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (producto.codigo_barra && producto.codigo_barra.includes(busqueda))
  );
  
  // Registrar movimiento de inventario
  const handleRegistrarMovimiento = async () => {
    if (!selectedProducto || cantidad <= 0) {
      setError('Seleccione un producto y una cantidad válida');
      return;
    }
    
    try {
      const movimiento: MovimientoInventario = {
        producto_id: selectedProducto,
        tipo_movimiento: tipoMovimiento,
        cantidad: cantidad
      };
      
      await inventarioService.registrarMovimiento(movimiento);
      
      // Actualizar listas
      const movimientosData = await inventarioService.getMovimientos();
      setMovimientos(movimientosData);
      
      const productosData = await productoService.getAll();
      setProductos(productosData);
      
      const stockBajoData = await inventarioService.getProductosStockBajo();
      setStockBajo(stockBajoData);
      
      // Limpiar formulario
      setSelectedProducto(null);
      setCantidad(1);
      setTipoMovimiento('entrada');
      
      setError(null);
    } catch (err) {
      setError('Error al registrar movimiento de inventario');
      console.error(err);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventario</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Registrar Movimiento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="producto" className="text-right">
                    Producto
                  </Label>
                  <Select 
                    onValueChange={(value) => setSelectedProducto(Number(value))}
                    value={selectedProducto?.toString()}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem 
                          key={producto.producto_id} 
                          value={producto.producto_id.toString()}
                        >
                          {producto.nombre} (Stock: {producto.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    onValueChange={(value) => setTipoMovimiento(value as 'entrada' | 'salida')}
                    value={tipoMovimiento}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleRegistrarMovimiento}>Registrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="productos">
          <TabsList className="mb-4">
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
            <TabsTrigger value="alertas">Alertas de Stock</TabsTrigger>
          </TabsList>
          
          <TabsContent value="productos">
            <Card>
              <CardHeader>
                <CardTitle>Productos en Inventario</CardTitle>
                <CardDescription>
                  Gestiona el stock de productos
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Buscar por nombre o código"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Cargando productos...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productosFiltrados.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No hay productos que coincidan con la búsqueda
                          </TableCell>
                        </TableRow>
                      ) : (
                        productosFiltrados.map((producto) => (
                          <TableRow key={producto.producto_id}>
                            <TableCell>{producto.producto_id}</TableCell>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{producto.codigo_barra || 'N/A'}</TableCell>
                            <TableCell>{producto.categoria_nombre || 'Sin categoría'}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={producto.stock > 10 ? "default" : "destructive"}
                              >
                                {producto.stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Ver Movimientos
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Movimientos de {producto.nombre}</DialogTitle>
                                  </DialogHeader>
                                  <div className="max-h-96 overflow-auto">
                                    {/* Aquí iría una tabla con los movimientos del producto */}
                                    <p>Implementación pendiente de movimientos por producto</p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="movimientos">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Inventario</CardTitle>
                <CardDescription>
                  Historial de entradas y salidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Cargando movimientos...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No hay movimientos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        movimientos.map((movimiento) => (
                          <TableRow key={movimiento.inventario_id}>
                            <TableCell>{movimiento.inventario_id}</TableCell>
                            <TableCell>
                              {productos.find(p => p.producto_id === movimiento.producto_id)?.nombre || 'Producto desconocido'}
                            </TableCell>
                            <TableCell>
                              {movimiento.tipo_movimiento === 'entrada' ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                                  <ArrowUpCircle className="h-3 w-3" />
                                  Entrada
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                                  <ArrowDownCircle className="h-3 w-3" />
                                  Salida
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{movimiento.cantidad}</TableCell>
                            <TableCell>
                              {new Date(movimiento.fecha || '').toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alertas">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Stock Bajo</CardTitle>
                <CardDescription>
                  Productos que requieren reabastecimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Cargando alertas...</p>
                ) : (
                  <>
                    {stockBajo.length === 0 ? (
                      <Alert className="bg-green-50 text-green-700 border-green-200">
                        <Package className="h-4 w-4" />
                        <AlertTitle>Todo en orden</AlertTitle>
                        <AlertDescription>
                          No hay productos con stock bajo en este momento
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stockBajo.map((producto) => (
                          <Card key={producto.producto_id} className="border-red-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                              <CardDescription>
                                {producto.codigo_barra || 'Sin código'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  <span>Stock actual:</span>
                                  <Badge variant="destructive">{producto.stock}</Badge>
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm">Reabastecer</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reabastecer {producto.nombre}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="cantidad-reabastecimiento" className="text-right">
                                          Cantidad
                                        </Label>
                                        <Input
                                          id="cantidad-reabastecimiento"
                                          type="number"
                                          min="1"
                                          defaultValue="10"
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancelar</Button>
                                      </DialogClose>
                                      <Button>Confirmar</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Inventario;
