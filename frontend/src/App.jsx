import { useState, useEffect } from 'react';
import { Login } from './components/auth/Login';
import { AdminUsuarios } from './components/auth/AdminUsuarios';
import { DashboardInventario } from './components/inventory/DashboardInventario';
import { Sidebar } from './components/shared/Sidebar';

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [seccionActual, setSeccionActual] = useState('inventario');
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token) {
      setEstaAutenticado(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setEstaAutenticado(false);
    setUser(null);
  };

  if (!estaAutenticado) {
    // ✅ 4. Recibir el usuario cuando el Login sea exitoso
    return <Login onLoginSuccess={(userData) => {
      setEstaAutenticado(true);
      setUser(userData);
    }} />;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919]">
      {/* ✅ 5. Ahora las variables user y handleLogout sí existen */}
      <Sidebar
        seccionActual={seccionActual}
        setSeccionActual={setSeccionActual}
        usuario={user}
        onLogout={handleLogout}
      />

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