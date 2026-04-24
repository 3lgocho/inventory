export const InventoryTable = ({ inventarioFiltrado, cargando, setItemSeleccionado, handleMoverInline }) => {
    return (
        <div className="w-full border border-zinc-200 dark:border-[#2e2e2e] rounded-lg overflow-hidden bg-white dark:bg-[#202020] shadow-sm">
            <table className="w-full text-sm border-collapse divide-y divide-zinc-200 dark:divide-[#2e2e2e]">
                <thead className="bg-zinc-50 dark:bg-[#242424]">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-1/3">Nombre</th>
                        <th className="py-3 px-4 text-center font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-24">Stock</th>
                        <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Categoría</th>
                        <th className="py-3 px-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Ubicación</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#2e2e2e]">
                    {cargando ? (
                        <tr><td colSpan="4" className="py-10 text-center text-zinc-500">Cargando Vault...</td></tr>
                    ) : inventarioFiltrado.length === 0 ? (
                        <tr><td colSpan="4" className="py-10 text-center text-zinc-500 italic">No hay resultados.</td></tr>
                    ) : (
                        inventarioFiltrado.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-[#2c2c2c] transition-colors group">
                                <td className="py-2.5 px-4 cursor-pointer font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2" onClick={() => setItemSeleccionado(item)}>
                                    <span className="text-zinc-400 group-hover:text-blue-500">📄</span>
                                    {item.name || item.nombre}
                                </td>
                                <td className="py-2.5 px-4 text-center font-medium">{item.total_amount || item.cantidad}</td>
                                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">
                                    <span className="bg-zinc-100 dark:bg-[#2c2c2c] px-2 py-1 rounded-md text-xs border border-transparent dark:border-[#3a3a3a]">{item.global_category || item.categoria_global}</span>
                                </td>
                                <td className="py-2.5 px-4">
                                    <select
                                        className="bg-transparent text-sm border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 rounded px-2 py-1 cursor-pointer focus:outline-none dark:text-zinc-300 dark:bg-[#202020]"
                                        value={item.location || item.ubicacion}
                                        onChange={(e) => handleMoverInline(item, e.target.value)}
                                    >
                                        <option value="IT">IT</option>
                                        <option value="Deposito">Deposito</option>
                                        <option value="En uso">En uso</option>
                                        <option value="Ronny">Ronny</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};