import { useState, useEffect } from 'react';
import { actualizarEquipo } from "../../services/api";

export const ItemSidePanel = ({ item, itemSeleccionado, onClose, recargarDatos, setItemSeleccionado }) => {
    const dataItem = item || itemSeleccionado;

    const [editandoAtributos, setEditandoAtributos] = useState(false);
    const [atributosEditables, setAtributosEditables] = useState({});

    // Extraemos attributes (nombre exacto que manda Rust)
    const atributosOriginales = dataItem?.attributes || dataItem?.atributos || {};

    useEffect(() => {
        if (dataItem) {
            setAtributosEditables(atributosOriginales);
        }
        setEditandoAtributos(false);
    }, [dataItem]);

    if (!dataItem) return null;

    // MATCH EXACTO CON TU BACKEND (models.rs -> ItemResponseDto)
    const nombre = dataItem.name || dataItem.nombre || 'Desconocido';
    const categoria = dataItem.global_category || dataItem.categoria_global || 'N/A';
    const cantidad = dataItem.total_amount !== undefined ? dataItem.total_amount : (dataItem.cantidad || 0);
    const stockMinimo = dataItem.minimum_stock !== undefined ? dataItem.minimum_stock : 0;
    const ubicacion = dataItem.ubicacion || 'N/A'; // Nota: La ubicación parece manejarse por stock, mantenemos el fallback

    const handleGuardar = async () => {
        try {
            // MATCH EXACTO CON TU BACKEND (update_handler.rs -> UpdateItemRequest)
            // Mandamos 'attributes', NO 'atributos'
            await actualizarEquipo(dataItem.id, { attributes: atributosEditables });

            setEditandoAtributos(false);

            // Actualizamos la UI inmediatamente
            if (setItemSeleccionado) {
                setItemSeleccionado({ ...dataItem, attributes: atributosEditables });
            }
            if (recargarDatos) recargarDatos();

        } catch (error) {
            console.error(error);
            alert("Error al intentar guardar en la base de datos.");
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-[#202020] shadow-2xl z-50 border-l border-zinc-200 dark:border-[#2e2e2e] flex flex-col transform translate-x-0 transition-transform duration-300">
                <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-[#2e2e2e]">
                    <h2 className="text-lg font-bold flex items-center gap-2">📄 {nombre}</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-xl">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* --- PROPIEDADES BÁSICAS --- */}
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Propiedades</h3>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm">
                            <span className="w-1/3 text-zinc-500">Ubicación</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{ubicacion}</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <span className="w-1/3 text-zinc-500">Categoría</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{categoria}</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <span className="w-1/3 text-zinc-500">Stock Actual</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{cantidad} unidades</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <span className="w-1/3 text-zinc-500">Stock Mínimo</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{stockMinimo} unidades</span>
                        </li>
                    </ul>

                    {/* --- HEADER ATRIBUTOS --- */}
                    <div className="flex justify-between items-center mb-4 mt-8">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Atributos Técnicos</h3>
                        {!editandoAtributos ? (
                            <button onClick={() => setEditandoAtributos(true)} className="text-xs text-blue-500 hover:text-blue-400 font-medium">Editar</button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditandoAtributos(false);
                                        setAtributosEditables(atributosOriginales);
                                    }}
                                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                                >
                                    Cancelar
                                </button>
                                <button onClick={handleGuardar} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                                    Guardar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- BLOQUE DE ATRIBUTOS --- */}
                    <div className="bg-[#242424] p-4 rounded-lg border border-[#2e2e2e]">
                        {!editandoAtributos ? (
                            /* --- MODO LECTURA --- */
                            Object.keys(atributosOriginales).length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300 marker:text-zinc-500">
                                    {Object.entries(atributosOriginales).map(([key, value]) => (
                                        <li key={key}>
                                            <span className="font-semibold text-zinc-400 capitalize">{key}:</span> {value}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-zinc-500 italic">Sin atributos registrados.</p>
                            )
                        ) : (
                            /* --- MODO EDICIÓN --- */
                            <div className="space-y-3">
                                {Object.entries(atributosEditables).map(([key, value]) => (
                                    <div key={key} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={key}
                                            disabled
                                            className="w-1/3 px-2 py-1 text-sm bg-[#191919] border border-[#3e3e3e] rounded text-zinc-500 cursor-not-allowed"
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => setAtributosEditables({ ...atributosEditables, [key]: e.target.value })}
                                            className="flex-grow px-2 py-1 text-sm bg-[#191919] border border-[#2e2e2e] rounded focus:outline-none focus:border-blue-500 text-zinc-200"
                                        />
                                        <button onClick={() => {
                                            const nuevos = { ...atributosEditables };
                                            delete nuevos[key];
                                            setAtributosEditables(nuevos);
                                        }} className="text-red-500 hover:text-red-400 px-2 text-lg font-bold">&times;</button>
                                    </div>
                                ))}

                                {/* Agregar nueva llave en modo edición */}
                                <div className="flex gap-2 items-center pt-3 mt-3 border-t border-[#333]">
                                    <input id="newEditKey" type="text" placeholder="Llave" className="w-1/3 px-2 py-1 text-sm bg-[#191919] border border-[#2e2e2e] rounded focus:outline-none focus:border-blue-500 text-zinc-200" />
                                    <input id="newEditVal" type="text" placeholder="Valor" className="flex-grow px-2 py-1 text-sm bg-[#191919] border border-[#2e2e2e] rounded focus:outline-none focus:border-blue-500 text-zinc-200" />
                                    <button onClick={() => {
                                        const k = document.getElementById('newEditKey').value.trim();
                                        const v = document.getElementById('newEditVal').value.trim();
                                        if (k && v) {
                                            setAtributosEditables({ ...atributosEditables, [k.toLowerCase()]: v });
                                            document.getElementById('newEditKey').value = '';
                                            document.getElementById('newEditVal').value = '';
                                        }
                                    }} className="bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded text-sm text-white text-xl pb-1.5 leading-none transition-colors">+</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};