import { useState } from 'react';
import { loginUsuario } from '../services/api';

export const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            // 1. Enviamos credenciales al backend en Rust
            const data = await loginUsuario(email, password);

            // 2. Si es exitoso, Rust nos devuelve un JWT. Lo guardamos en la bóveda de seguridad del navegador.
            localStorage.setItem('token', data.token);

            // 3. Le avisamos a App.jsx que cambie el estado y quite la "puerta" de seguridad.
            onLoginSuccess();
        } catch (err) {
            setError('Credenciales incorrectas o servidor inaccesible.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#191919] transition-colors duration-300">
            <div className="max-w-md w-full p-8 bg-white dark:bg-[#202020] rounded-xl shadow-sm border border-zinc-200 dark:border-[#2e2e2e]">
                <div className="text-center mb-8">
                    <span className="text-4xl block mb-3">📦</span>
                    <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tight">Entrar al Vault</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Ingresa tus credenciales de acceso</p>
                </div>

                {error && (
                    <div className="mb-5 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-200 dark:border-red-900/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 transition-colors"
                            placeholder="admin@it.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className={`w-full py-2.5 px-4 mt-2 rounded-md text-white font-medium text-sm transition-colors ${cargando
                            ? 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500'
                            }`}
                    >
                        {cargando ? 'Autenticando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};