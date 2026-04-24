import { useState, useEffect } from 'react';
import { actualizarEquipo } from "../../services/api";

export const ItemSidePanel = ({ item, onClose, recargarDatos, setItemSeleccionado }) => {
    const [editando, setEditando] = useState(false);
    const [atributosEditables, setAtributosEditables] = useState({});

    useEffect(() => {
        if (item) setAtributosEditables(item.attributes || item.atributos || {});
        setEditando(false);
    }, [item]);

    if (!item) return null;

    const handleGuardar = async () => {
        try {
            await actualizarEquipo(item.id, { atributos: atributosEditables });
            setEditando(false);
            setItemSeleccionado({ ...item, attributes: atributosEditables });
            recargarDatos();
        } catch (error) {
            alert("Error al intentar guardar en la base de datos.");
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-[#202020] shadow-2xl z-50 border-l border-zinc-200 dark:border-[#2e2e2e] flex flex-col transform translate-x-0 transition-transform duration-300">
                <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-[#2e2e2e]">
                    <h2 className="text-lg font-bold flex items-center gap-2">📄 {item.name || item.nombre}</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* ... Aquí mantienes tu código original del panel de propiedades y atributos (sin cambios) ... */}
                    <div className="flex justify-between items-center mb-4 mt-8">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Atributos Técnicos</h3>
                        {!editando ? (
                            <button onClick={() => setEditando(true)} className="text-xs text-blue-500 hover:text-blue-400">Editar</button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleGuardar} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">Guardar</button>
                            </div>
                        )}
                    </div>
                    {/* El resto de la renderización del objeto atributosEditables que ya tenías */}
                </div>
            </div>
        </>
    );
};