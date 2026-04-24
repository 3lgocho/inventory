// frontend/src/App.jsx
import { useState, useEffect } from 'react';

// Fíjate cómo ahora apuntamos a las nuevas subcarpetas
import { Login } from './components/auth/Login';
import { AdminUsuarios } from './components/auth/AdminUsuarios';
import { DashboardInventario } from './components/inventory/DashboardInventario';
import { Sidebar } from './components/shared/Sidebar';

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

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* App.jsx solo llama al Padre. El Padre ya tiene adentro la tabla y el modal */}
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