export const CreateItemModal = ({ isOpen, onClose, onSubmit, nuevoItem, setNuevoItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#202020] border border-zinc-200 dark:border-[#2e2e2e] rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Agregar al Vault</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xl">&times;</button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-zinc-500 mb-1">Nombre</label>
                        <input required spellCheck={true} lang="es" type="text" value={nuevoItem.nombre} onChange={e => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#191919] border border-zinc-200 dark:border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
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