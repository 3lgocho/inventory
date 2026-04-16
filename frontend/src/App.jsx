import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { DashboardInventario } from './components/DashboardInventario';
import { AdminUsuarios } from './components/AdminUsuarios';

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [seccionActual, setSeccionActual] = useState('inventario');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const token = localStorage.getItem('token');
    if (token) setEstaAutenticado(true);
  }, []);

  if (!estaAutenticado) {
    return <Login onLoginSuccess={() => setEstaAutenticado(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919]">
      <Sidebar seccionActual={seccionActual} setSeccionActual={setSeccionActual} />

      {/* El contenido cambia según el botón que presiones en el Sidebar */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {seccionActual === 'inventario' && <DashboardInventario />}
        {seccionActual === 'usuarios' && <AdminUsuarios />}

        {seccionActual === 'movimientos' && (
          <div className="flex-1 p-10 text-zinc-500">Historial de movimientos próximamente...</div>
        )}
      </main>
    </div>
  );
}

export default App;