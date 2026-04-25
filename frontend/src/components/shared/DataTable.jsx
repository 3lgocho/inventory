export const DataTable = ({ columnas, data, cargando, mensajeVacio = "No hay resultados." }) => {
    return (
        <div className="w-full border border-zinc-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden bg-white dark:bg-[#202020] shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-[#252525] border-b border-zinc-200 dark:border-[#2e2e2e]">
                    <tr>
                        {columnas.map((col, idx) => (
                            <th key={idx} className={`px-4 py-3 align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ${col.thClassName || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#2e2e2e]">
                    {cargando ? (
                        <tr><td colSpan={columnas.length} className="p-10 text-center text-zinc-500">Cargando datos...</td></tr>
                    ) : data.length === 0 ? (
                        <tr><td colSpan={columnas.length} className="p-10 text-center text-zinc-500 italic">{mensajeVacio}</td></tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr key={item.id || rowIndex} className="hover:bg-zinc-50 dark:hover:bg-[#252525] transition-colors group">
                                {columnas.map((col, colIndex) => (
                                    <td key={colIndex} className={`p-4 align-middle whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-200 ${col.tdClassName || ''}`}>
                                        {col.render ? col.render(item) : item[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};