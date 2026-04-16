import { useState, useEffect } from 'react';
import { obtenerUsuarios, registrarUsuario } from '../services/api';

export const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', password: '' });

    const cargarUsuarios = async () => {
        try {
            const respuesta = await obtenerUsuarios();
            // EL FIX ESTÁ AQUÍ: Apunta directo a respuesta.data
            setUsuarios(respuesta.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        await registrarUsuario(nuevoUsuario.nombre, nuevoUsuario.email, nuevoUsuario.password);
        setMostrarModal(false);
        setNuevoUsuario({ nombre: '', email: '', password: '' });
        cargarUsuarios();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-100">Gestión de Usuarios</h2>
                <button
                    onClick={() => setMostrarModal(true)}
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
                            <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2e2e2e]">
                        {usuarios.map(user => (
                            <tr key={user.id} className="hover:bg-[#252525] transition-colors">
                                <td className="p-4 text-zinc-200 text-sm">{user.nombre}</td>
                                <td className="p-4 text-zinc-400 text-sm font-mono">{user.email}</td>
                                <td className="p-4">
                                    <button className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
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

                        <form onSubmit={handleCrear} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-zinc-500 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={nuevoUsuario.nombre}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-500 mb-1">Correo Electrónico</label>
                                <input
                                    required
                                    type="email"
                                    value={nuevoUsuario.email}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-500 mb-1">Contraseña Temporal</label>
                                <input
                                    required
                                    type="password"
                                    value={nuevoUsuario.password}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200"
                                />
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