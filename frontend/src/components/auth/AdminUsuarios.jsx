import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // <-- Importamos los iconos
import { obtenerUsuarios, registrarUsuario } from "../../services/api";

// Añadimos 'rolActual' como prop. Lo ideal es que se lo pases desde tu App/Context 
// leyendo el token guardado en localStorage.
export const AdminUsuarios = ({ rolActual = 'Admin' }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Añadimos el estado 'role' y lo inicializamos por defecto en 'Admin'
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        email: '',
        password: '',
        password_confirm: '',
        role: 'Admin'
    });

    const [error, setError] = useState('');

    // Estados para los ojitos de las contraseñas
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarPasswordConfirm, setMostrarPasswordConfirm] = useState(false);

    const isSuperAdmin = rolActual === 'SuperAdmin';

    const cargarUsuarios = async () => {
        try {
            const respuesta = await obtenerUsuarios();
            setUsuarios(respuesta.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        setError('');

        // 1. VALIDACIÓN: Las contraseñas deben coincidir
        if (nuevoUsuario.password !== nuevoUsuario.password_confirm) {
            setError('Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }

        try {
            // Nota: Asegúrate de que registrarUsuario en tu api.js reciba el parámetro 'role'
            // si planeas guardarlo en la base de datos.
            await registrarUsuario(nuevoUsuario.nombre, nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.role);

            setMostrarModal(false);
            // Reseteamos el formulario
            setNuevoUsuario({ nombre: '', email: '', password: '', password_confirm: '', role: 'Admin' });
            setMostrarPassword(false);
            setMostrarPasswordConfirm(false);

            cargarUsuarios();
        } catch (err) {
            // Atrapamos el error del backend
            setError(err.message || 'Error al intentar crear el usuario.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-100">Gestión de Usuarios</h2>
                <button
                    onClick={() => {
                        setMostrarModal(true);
                        setError('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    + Nuevo Usuario
                </button>
            </div>

            <div className="bg-[#202020] border border-[#2e2e2e] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#2e2e2e] bg-[#252525]">
                            <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Nombre</th>
                            <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Email</th>
                            <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Rol</th>
                            <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2e2e2e]">
                        {usuarios.map(user => (
                            <tr key={user.id} className="hover:bg-[#252525] transition-colors">
                                <td className="p-4 text-zinc-200 text-sm">{user.name}</td>
                                <td className="p-4 text-zinc-400 text-sm font-mono">{user.email}</td>
                                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">
                                    <span className={`px-2 py-1 rounded-md text-xs border border-transparent ${user.role === 'SuperAdmin' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-zinc-100 dark:bg-[#2c2c2c] dark:border-[#3a3a3a]'}`}>
                                        {user.role || 'Admin'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button
                                        className="text-blue-500 hover:text-blue-400 text-sm cursor-not-allowed opacity-50"
                                        title="Ruta backend pendiente (Falta PATCH /api/auth/update)"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="text-red-500 hover:text-red-400 text-sm cursor-not-allowed opacity-50"
                                        title="Ruta backend pendiente (Falta DELETE /api/auth/users/:id)"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL PARA AGREGAR NUEVO USUARIO --- */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-[#202020] border border-[#2e2e2e] rounded-lg shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-zinc-100">Registrar Usuario</h2>
                            <button onClick={() => setMostrarModal(false)} className="text-zinc-400 hover:text-zinc-200 text-xl">&times;</button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-md bg-red-900/20 text-red-400 text-sm border border-red-900/50 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCrear} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-zinc-500 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={nuevoUsuario.nombre}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-zinc-500 mb-1">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@it.com"
                                        value={nuevoUsuario.email}
                                        onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                </div>
                                {/* --- SELECT CONDICIONAL DE ROL --- */}
                                <div className="w-1/3">
                                    <label className="block text-zinc-500 mb-1">Rol</label>
                                    <select
                                        value={nuevoUsuario.role}
                                        onChange={e => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                                        disabled={!isSuperAdmin} // Bloqueado si no es SuperAdmin
                                        className={`w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed text-zinc-500' : ''}`}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                    </select>
                                </div>
                            </div>

                            {/* --- INPUT CONTRASEÑA --- */}
                            <div>
                                <label className="block text-zinc-500 mb-1">Contraseña</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={mostrarPassword ? "text" : "password"}
                                        value={nuevoUsuario.password}
                                        onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                    >
                                        {mostrarPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* --- INPUT CONFIRMAR CONTRASEÑA --- */}
                            <div>
                                <label className="block text-zinc-500 mb-1">Confirmar Contraseña</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={mostrarPasswordConfirm ? "text" : "password"}
                                        value={nuevoUsuario.password_confirm}
                                        onChange={e => setNuevoUsuario({ ...nuevoUsuario, password_confirm: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarPasswordConfirm(!mostrarPasswordConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                    >
                                        {mostrarPasswordConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setMostrarModal(false)} className="px-4 py-2 rounded-md hover:bg-[#2c2c2c] text-zinc-300 transition-colors">Cancelar</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">Guardar Usuario</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};