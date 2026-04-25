import { DataTable } from '../shared/DataTable';

export const InventoryTable = ({ inventarioFiltrado, cargando, setItemSeleccionado, handleMoverInline }) => {

    const columnasInventario = [
        {
            header: 'Nombre',
            //thClassName: 'w-1/3',
            render: (item) => (
                <div className="cursor-pointer font-medium flex items-center gap-2" onClick={() => setItemSeleccionado(item)}>
                    {/*<span className="text-zinc-400 group-hover:text-blue-500">📄</span>*/}
                    {item.name || item.nombre}
                </div>
            )
        },
        {
            header: 'Stock',
            thClassName: 'text-center',
            tdClassName: 'text-center font-medium',
            render: (item) => item.total_amount || item.cantidad

        },
        {
            header: 'Categoría',
            render: (item) => (
                <span className="bg-zinc-100 dark:bg-[#2c2c2c] text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md text-xs border border-transparent dark:border-[#3a3a3a]">
                    {item.global_category || item.categoria_global}
                </span>
            )
        },
        {
            header: 'Ubicación',
            render: (item) => (
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
            )
        }
    ];

    return (
        <DataTable
            columnas={columnasInventario}
            data={inventarioFiltrado}
            cargando={cargando}
            mensajeVacio="No hay equipos en el inventario."
        />
    );
};