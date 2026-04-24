import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export const CreateItemModal = ({ isOpen, onClose, onSubmit, nuevoItem, setNuevoItem, itemsExistentes = [] }) => {
    const [sugerencia, setSugerencia] = useState('');

    // 1. DICCIONARIO COMBINADO
    // Mezcla los items del backend (itemsExistentes) con tu diccionario predefinido
    const diccionarioBase = useMemo(() => {
        const diccionarioEstatico = [
            "Cable UTP Cat 6",
            "Monitor",
            "Teclado",
            "Mouse",
            "Router Cisco",
            "Switch TP-Link",
            "Patch Cord",
            "Conector RJ45",
            "Destornillador"
        ];
        // Combina y elimina duplicados usando un Set
        return [...new Set([...diccionarioEstatico, ...itemsExistentes])];
    }, [itemsExistentes]);

    // 2. CONFIGURACIÓN DE FUSE
    const fuse = useMemo(() => new Fuse(diccionarioBase, {
        threshold: 0.3, // 0 es coincidencia exacta, 1 es muy permisivo
    }), [diccionarioBase]);

    // 3. MANEJADORES DE EVENTOS
    const handleNombreChange = (e) => {
        let valor = e.target.value;

        // Normalización: Capitalizar la primera letra automáticamente
        if (valor.length > 0) {
            valor = valor.charAt(0).toUpperCase() + valor.slice(1);
        }

        setNuevoItem({ ...nuevoItem, nombre: valor });

        // La lógica de Fuse.js sigue funcionando igual con el valor ya capitalizado
        if (valor.trim() === '') {
            setSugerencia('');
            return;
        }

        const resultados = fuse.search(valor);
        if (resultados.length > 0) {
            const mejorCoincidencia = resultados[0].item;
            if (mejorCoincidencia.toLowerCase().startsWith(valor.toLowerCase())) {
                setSugerencia(valor + mejorCoincidencia.slice(valor.length));
            } else {
                setSugerencia('');
            }
        } else {
            setSugerencia('');
        }
    };
    const handleKeyDown = (e) => {
        // Autocompletar con Tab
        if (e.key === 'Tab' && sugerencia) {
            e.preventDefault(); // Evita saltar al siguiente input
            setNuevoItem({ ...nuevoItem, nombre: sugerencia });
            setSugerencia('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#202020] border border-zinc-200 dark:border-[#2e2e2e] rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Agregar al Vault</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xl">&times;</button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4 text-sm">
                    {/* CAMPO DE NOMBRE MODIFICADO PARA GHOST TEXT */}
                    <div>
                        <label className="block text-zinc-500 mb-1">Nombre</label>
                        <div className="relative w-full bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
                            {/* Input Fantasma (Sugerencia en Gris) */}
                            <input
                                type="text"
                                value={sugerencia}
                                readOnly
                                tabIndex="-1"
                                className="absolute inset-0 w-full px-3 py-2 bg-transparent text-zinc-400 dark:text-zinc-600 pointer-events-none"
                            />
                            {/* Input Real (Transparente) */}
                            <input
                                required
                                spellCheck={false} // Desactivado para que la línea roja no arruine la ilusión visual
                                type="text"
                                value={nuevoItem.nombre}
                                onChange={handleNombreChange}
                                onKeyDown={handleKeyDown}
                                className="relative z-10 w-full px-3 py-2 bg-transparent focus:outline-none"
                            />
                        </div>
                        {/* Pequeña ayuda visual opcional debajo */}
                        <p className="text-xs text-zinc-400 mt-1 h-4">
                            {sugerencia && "Presiona Tab ↹ para autocompletar"}
                        </p>
                    </div>

                    {/* El resto de tus inputs (Categoría, Stock, Mínimo, Ubicación) siguen exactamente igual... */}
                    <div>
                        <label className="block text-zinc-500 mb-1">Categoría</label>
                        <select required value={nuevoItem.categoria_global} onChange={e => setNuevoItem({ ...nuevoItem, categoria_global: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="" disabled>Selecciona una categoría...</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Redes">Redes</option>
                            <option value="Complemento">Complemento</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-zinc-500 mb-1">Stock</label>
                            <input required type="number" min="1" value={nuevoItem.cantidad} onChange={e => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-zinc-500 mb-1">Mínimo</label>
                            <input required type="number" min="0" value={nuevoItem.stock_minimo} onChange={e => setNuevoItem({ ...nuevoItem, stock_minimo: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-zinc-500 mb-1">Ubicación</label>
                            <select value={nuevoItem.ubicacion} onChange={e => setNuevoItem({ ...nuevoItem, ubicacion: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="IT">IT</option>
                                <option value="Deposito">Deposito</option>
                                <option value="En uso">En uso</option>
                                <option value="Ronny">Ronny</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-[#2c2c2c]">Cancelar</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};