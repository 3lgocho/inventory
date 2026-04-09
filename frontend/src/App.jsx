import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { DashboardInventario } from './components/DashboardInventario';

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const token = localStorage.getItem('token');
    if (token) {
      setEstaAutenticado(true);
    }
  }, []);

  // El Gran Interruptor: Si no hay token, bloquea el paso y muestra Login
  if (!estaAutenticado) {
    return <Login onLoginSuccess={() => setEstaAutenticado(true)} />;
  }

  // Si hay token, muestra el Vault
  return <DashboardInventario />;
}

export default App;