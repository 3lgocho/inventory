import { useState } from 'react';
import { Package, Lock } from 'lucide-react';
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
            const data = await loginUsuario(email, password);
            // Guardamos el token en la bóveda del navegador
            localStorage.setItem('token', data.token);
            onLoginSuccess(); // Le avisamos a App.jsx que abra las puertas
        } catch (err) {
            setError('Acceso denegado. Revisa tu correo o contraseña.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#191919] text-zinc-900 dark:text-zinc-200 transition-colors duration-300">
            <div className="w-full max-w-sm p-8 bg-white dark:bg-[#202020] rounded-xl shadow-sm border border-zinc-200 dark:border-[#2e2e2e]">

                <div className="flex flex-col items-center mb-8">
                    <span className="text-4xl mb-3">📦</span>
                    <h1 className="text-2xl font-bold tracking-tight">Entrar al Vault</h1>
                    <p className="text-sm text-zinc-500 mt-1">Identifícate para continuar</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="a@it.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full flex justify-center items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 mt-2"
                    >
                        {cargando ? 'Verificando...' : (
                            <>
                                <Lock className="w-4 h-4" /> Acceder
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};