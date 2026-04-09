import { Box, ClipboardList, Settings, Users } from 'lucide-react';

export const Sidebar = ({ seccionActual, setSeccionActual }) => {
    const menuItems = [
        { id: 'inventario', label: 'Inventario', icon: Box },
        { id: 'movimientos', label: 'Movimientos', icon: ClipboardList },
        { id: 'usuarios', label: 'Administrar Usuarios', icon: Users },
        { id: 'configuracion', label: 'Configuración', icon: Settings },
    ];

    return (
        <aside className="w-64 flex flex-col p-6 bg-zinc-50 dark:bg-[#202020] border-r border-zinc-200 dark:border-[#2e2e2e] select-none">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-zinc-200 dark:border-[#2e2e2e]">
                <span className="text-3xl">📦</span>
                <h1 className="text-2xl font-bold tracking-tight dark:text-zinc-100">Vault</h1>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSeccionActual(item.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium transition-colors ${seccionActual === item.id
                            ? 'bg-zinc-200/50 dark:bg-[#2c2c2c] text-zinc-950 dark:text-zinc-50'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2c2c2c]'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};