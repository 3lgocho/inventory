import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { obtenerInventario, moverEquipo, crearEquipo } from '../../services/api';
import { InventoryTable } from './InventoryTable';
import { CreateItemModal } from './CreateItemModal';
import { ItemSidePanel } from './ItemSidePanel';

export const DashboardInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: '', categoria_global: '', ubicacion: 'IT', cantidad: 1, stock_minimo: 1, atributos: {}
  });

  const cargarDatos = async () => {
    try {
      const datos = await obtenerInventario();
      setInventario(datos.data || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleMoverInline = async (item, nuevaUbicacion) => {
    if (!nuevaUbicacion || nuevaUbicacion === item.ubicacion) return;
    try {
      await moverEquipo(item.id, nuevaUbicacion);
      cargarDatos();
      if (itemSeleccionado?.id === item.id) {
        setItemSeleccionado({ ...item, ubicacion: nuevaUbicacion });
      }
    } catch (error) {
      console.error(error);
      alert("Error al mover el equipo");
    }
  };

  const handleCrearSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEquipo({
        name: nuevoItem.nombre,
        global_category: nuevoItem.categoria_global,
        location: nuevoItem.ubicacion,
        amount: parseInt(nuevoItem.cantidad),
        minimum_stock: parseInt(nuevoItem.stock_minimo),
        attributes: nuevoItem.atributos || {}
      });
      setIsModalOpen(false);
      setNuevoItem({ nombre: '', categoria_global: '', ubicacion: 'IT', cantidad: 1, stock_minimo: 1, atributos: {} });
      cargarDatos();
    } catch (error) {
      alert("Error al guardar en la base de datos");
    }
  };

  const inventarioFiltrado = inventario.filter(item =>
    (item.nombre || item.name || "").toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
      <main className="flex-1 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">Panel Central</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
              <input
                type="search"
                placeholder="Buscar equipo..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-[#202020] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              <Plus className="w-4 h-4" /> Nuevo
            </button>
          </div>
        </div>

        <InventoryTable
          inventarioFiltrado={inventarioFiltrado}
          cargando={cargando}
          setItemSeleccionado={setItemSeleccionado}
          handleMoverInline={handleMoverInline}
        />
      </main>

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCrearSubmit}
        nuevoItem={nuevoItem}
        setNuevoItem={setNuevoItem}
      />

      <ItemSidePanel
        item={itemSeleccionado}
        onClose={() => setItemSeleccionado(null)}
        recargarDatos={cargarDatos}
        setItemSeleccionado={setItemSeleccionado}
      />
    </div>
  );
};