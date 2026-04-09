import { useState, useEffect } from 'react';
import { obtenerUsuarios, registrarUsuario } from '../services/api';

export const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', password: '' });

    const cargarUsuarios = async () => {
        // Nota: Necesitaremos crear 'obtenerUsuarios' en api.js
        const data = await obtenerUsuarios();
        setUsuarios(data);
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

            {/* Aquí iría el Modal para el formulario de registro (opcional) */}
        </div>
    );
};