import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { obtenerUsuarios, registrarUsuario, actualizarUsuario } from "../../services/api";
import { DataTable } from '../shared/DataTable';

export const AdminUsuarios = ({ rolActual = 'Admin' }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estado del Modal y Formulario
    const [modal, setModal] = useState({ isOpen: false, editMode: false, userId: null });
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '', password_confirm: '', role: 'Admin' });

    const [error, setError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarPasswordConfirm, setMostrarPasswordConfirm] = useState(false);

    const isSuperAdmin = rolActual === 'SuperAdmin';

    const cargarUsuarios = async () => {
        try {
            const res = await obtenerUsuarios();
            setUsuarios(res.data || []);
        } finally { setCargando(false); }
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const abrirCrear = () => {
        setFormData({ nombre: '', email: '', password: '', password_confirm: '', role: 'Admin' });
        setModal({ isOpen: true, editMode: false, userId: null });
        setError('');
    };

    const abrirEditar = (u) => {
        setFormData({ nombre: u.name, email: u.email, password: '', password_confirm: '', role: u.role || 'Admin' });
        setModal({ isOpen: true, editMode: true, userId: u.id });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación de contraseñas (solo obligatoria en creación o si se escribe algo en edición)
        if (!modal.editMode || formData.password) {
            if (formData.password !== formData.password_confirm) {
                return setError('Las contraseñas no coinciden.');
            }
        }

        try {
            if (modal.editMode) {
                await actualizarUsuario(modal.userId, formData);
            } else {
                await registrarUsuario(formData.nombre, formData.email, formData.password, formData.role);
            }
            setModal({ ...modal, isOpen: false });
            cargarUsuarios();
        } catch (err) {
            setError(err.message || 'Error al guardar el usuario.');
        }
    };

    const columnas = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Email', render: (u) => <span className="text-zinc-400 font-mono">{u.email}</span> },
        {
            header: 'Rol', render: (u) => (
                <span className={`px-2 py-1 rounded-md text-xs border border-transparent ${u.role === 'SuperAdmin' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-zinc-100 dark:bg-[#2c2c2c] dark:border-[#3a3a3a]'}`}>
                    {u.role || 'Admin'}
                </span>
            )
        },
        {
            header: 'Acciones', render: (u) => (
                <div className="flex gap-3">
                    <button onClick={() => abrirEditar(u)} className="text-blue-500 hover:text-blue-400 text-sm">Editar</button>
                    <button className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 flex-1 relative" >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-100">Gestión de Usuarios</h2>
                <button onClick={abrirCrear} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    + Nuevo
                </button>
            </div>

            <DataTable columnas={columnas} data={usuarios} cargando={cargando} />

            {/* --- MODAL RESTAURADO --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-[#202020] border border-[#2e2e2e] rounded-lg shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-zinc-100">
                                {modal.editMode ? 'Editar Usuario' : 'Registrar Usuario'}
                            </h2>
                            <button onClick={() => setModal({ ...modal, isOpen: false })} className="text-zinc-400 hover:text-zinc-200 text-xl">&times;</button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-md bg-red-900/20 text-red-400 text-sm border border-red-900/50 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            {/* Nombre */}
                            <div>
                                <label className="block text-zinc-500 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                />
                            </div>

                            {/* Email y Rol en la misma fila */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-zinc-500 mb-1">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-zinc-500 mb-1">Rol</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        disabled={!isSuperAdmin}
                                        className={`w-full px-3 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed text-zinc-500' : ''}`}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-zinc-500 mb-1">
                                    {modal.editMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                </label>
                                <div className="relative">
                                    <input
                                        required={!modal.editMode}
                                        type={mostrarPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                                    >
                                        {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-zinc-500 mb-1">Confirmar Contraseña</label>
                                <div className="relative">
                                    <input
                                        required={!modal.editMode || formData.password !== ''}
                                        type={mostrarPasswordConfirm ? "text" : "password"}
                                        value={formData.password_confirm}
                                        onChange={e => setFormData({ ...formData, password_confirm: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 bg-[#191919] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarPasswordConfirm(!mostrarPasswordConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                                    >
                                        {mostrarPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModal({ ...modal, isOpen: false })}
                                    className="px-4 py-2 rounded-md hover:bg-[#2c2c2c] text-zinc-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                                >
                                    {modal.editMode ? 'Guardar Cambios' : 'Registrar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};