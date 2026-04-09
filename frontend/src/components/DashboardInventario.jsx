import { useEffect, useState } from 'react';
import { LayoutGrid, ClipboardList, Settings, Search, Sun, Moon, Plus } from 'lucide-react';
import { obtenerInventario, moverEquipo, crearEquipo } from '../services/api';

export const DashboardInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // UX States
  const [darkMode, setDarkMode] = useState(true);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  // Estado para el Modal de Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: '', categoria_global: '', ubicacion: 'IT', cantidad: 1, stock_minimo: 1, atributos: {}
  });

  const cargarDatos = async () => {
    try {
      const datos = await obtenerInventario();
      const itemsAplanados = Object.values(datos).flat();
      setInventario(itemsAplanados);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // Lógica limpia para el Modo Oscuro
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

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
      alert("Hubo un error al mover el equipo");
    }
  };

  // Función para manejar el formulario de creación
  const handleCrearSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEquipo({
        ...nuevoItem,
        cantidad: parseInt(nuevoItem.cantidad),
        stock_minimo: parseInt(nuevoItem.stock_minimo)
      });
      setIsModalOpen(false);
      setNuevoItem({ nombre: '', categoria_global: '', ubicacion: 'IT', cantidad: 1, stock_minimo: 1, atributos: {} });
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el nuevo equipo en la base de datos");
    }
  };

  const inventarioFiltrado = inventario.filter(item =>
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">

      {/* --- PANEL LATERAL IZQUIERDO --- */}
      <aside className="w-64 flex flex-col p-6 bg-zinc-50 dark:bg-[#202020] border-r border-zinc-200 dark:border-[#2e2e2e]">
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-zinc-200 dark:border-[#2e2e2e]">
          <span className="text-3xl">📦</span>
          <h1 className="text-2xl font-bold tracking-tight">Vault</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 p-2.5 rounded-md text-sm font-medium bg-zinc-200/50 dark:bg-[#2c2c2c] text-zinc-950 dark:text-zinc-50">
            <LayoutGrid className="w-5 h-5" /> Inventario
          </a>
          <a href="#" className="flex items-center gap-3 p-2.5 rounded-md text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2c2c2c] transition-colors">
            <ClipboardList className="w-5 h-5" /> Movimientos
          </a>
          <a href="#" className="flex items-center gap-3 p-2.5 rounded-md text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2c2c2c] transition-colors">
            <Settings className="w-5 h-5" /> Configuración
          </a>
        </nav>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <main className="flex-1 p-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-100">Panel Central</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
              <input
                type="search"
                placeholder="Buscar equipo..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-[#202020] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* BOTÓN NUEVO (La Crucesita) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md border border-zinc-200 dark:border-[#2e2e2e] hover:bg-zinc-100 dark:hover:bg-[#2c2c2c] text-zinc-500 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div
              title="Cerrar Sesión"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload(); // Recarga y lo devuelve al login
              }}
              className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-100 border border-zinc-600 cursor-pointer shadow-sm hover:bg-red-600 transition-colors"
            >
              AG
            </div>
          </div>
        </div>

        {/* --- TABLA INVENTARIO --- */}
        <div className="w-full border border-zinc-200 dark:border-[#2e2e2e] rounded-lg overflow-hidden bg-white dark:bg-[#202020] shadow-sm">
          <table className="w-full text-sm border-collapse divide-y divide-zinc-200 dark:divide-[#2e2e2e]">
            <thead className="bg-zinc-50 dark:bg-[#242424]">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-1/3">Nombre</th>
                <th className="py-3 px-4 text-center font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-24">Stock</th>
                <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Categoría</th>
                <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-[#2e2e2e]">
              {cargando ? (
                <tr><td colSpan="4" className="py-10 text-center text-zinc-500">Cargando Vault...</td></tr>
              ) : inventarioFiltrado.length === 0 ? (
                <tr><td colSpan="4" className="py-10 text-center text-zinc-500 italic">No hay resultados.</td></tr>
              ) : (
                inventarioFiltrado.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-[#2c2c2c] transition-colors group">
                    <td
                      className="py-2.5 px-4 cursor-pointer font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2"
                      onClick={() => setItemSeleccionado(item)}
                    >
                      <span className="text-zinc-400 group-hover:text-blue-500">📄</span>
                      {item.nombre}
                    </td>
                    <td className="py-2.5 px-4 text-center font-medium">{item.cantidad}</td>
                    <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">
                      <span className="bg-zinc-100 dark:bg-[#2c2c2c] px-2 py-1 rounded-md text-xs border border-transparent dark:border-[#3a3a3a]">
                        {item.categoria_global}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <select
                        className="bg-transparent text-sm border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 rounded px-2 py-1 cursor-pointer focus:outline-none dark:text-zinc-300 dark:bg-[#202020]"
                        value={item.ubicacion}
                        onChange={(e) => handleMoverInline(item, e.target.value)}
                      >
                        <option value="IT">IT</option>
                        <option value="Deposito">Deposito</option>
                        <option value="En uso">En uso</option>
                        <option value="Ronny">Ronny</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- MODAL PARA AGREGAR NUEVO EQUIPO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#202020] border border-zinc-200 dark:border-[#2e2e2e] rounded-lg shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Agregar al Vault</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-200 text-xl">&times;</button>
            </div>

            <form onSubmit={handleCrearSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-zinc-500 mb-1">Nombre</label>
                <input required type="text" value={nuevoItem.nombre} onChange={e => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Categoría</label>
                <input required type="text" placeholder="Ej. Monitor HDMI" value={nuevoItem.categoria_global} onChange={e => setNuevoItem({ ...nuevoItem, categoria_global: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-zinc-500 mb-1">Stock Inicial</label>
                  <input required type="number" min="1" value={nuevoItem.cantidad} onChange={e => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="w-1/3">
                  <label className="block text-zinc-500 mb-1">Stock Mínimo</label>
                  <input required type="number" min="0" value={nuevoItem.stock_minimo} onChange={e => setNuevoItem({ ...nuevoItem, stock_minimo: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="w-1/3">
                  <label className="block text-zinc-500 mb-1">Ubicación</label>
                  <select value={nuevoItem.ubicacion} onChange={e => setNuevoItem({ ...nuevoItem, ubicacion: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="IT">IT</option>
                    <option value="Deposito">Deposito</option>
                    <option value="En uso">En uso</option>
                    <option value="Ronny">Ronny</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-[#2c2c2c] transition-colors">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">Guardar Equipo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDE PEEK (PANEL DERECHO FLOTANTE) --- */}
      {itemSeleccionado && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setItemSeleccionado(null)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-[#202020] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-zinc-200 dark:border-[#2e2e2e] flex flex-col ${itemSeleccionado ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {itemSeleccionado && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold flex items-center gap-2">
                📄 {itemSeleccionado.nombre}
              </h2>
              <button
                onClick={() => setItemSeleccionado(null)}
                className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Propiedades</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm">
                  <span className="w-1/3 text-zinc-500">Ubicación</span>
                  <span className="font-medium">{itemSeleccionado.ubicacion}</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-1/3 text-zinc-500">Categoría</span>
                  <span className="font-medium">{itemSeleccionado.categoria_global}</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-1/3 text-zinc-500">Stock Actual</span>
                  <span className="font-medium">{itemSeleccionado.cantidad} unidades</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-1/3 text-zinc-500">Stock Mínimo</span>
                  <span className="font-medium">{itemSeleccionado.stock_minimo} unidades</span>
                </li>
              </ul>

              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Atributos Técnicos</h3>
              <div className="bg-zinc-50 dark:bg-[#242424] p-4 rounded-lg border border-zinc-100 dark:border-[#2e2e2e]">
                {Object.keys(itemSeleccionado.atributos || {}).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.entries(itemSeleccionado.atributos).map(([key, value]) => (
                      <li key={key} className="text-sm flex justify-between">
                        <span className="text-zinc-500 capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500 italic">Sin atributos registrados.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};