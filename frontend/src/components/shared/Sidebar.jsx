import { useState } from 'react';
import { Box, ClipboardList, Users, Monitor, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

export const Sidebar = ({ seccionActual, setSeccionActual, usuario, onLogout }) => {
    const [expanded, setExpanded] = useState(true);
    const nombreUsuario = usuario?.username || "Invitado";
    const rolUsuario = usuario?.role || "Sin rol";

    const menuItems = [
        { id: 'inventario', label: 'Inventario', icon: Box },
        { id: 'computadoras', label: 'Armar Computadora', icon: Monitor },
        { id: 'movimientos', label: 'Movimientos', icon: ClipboardList },
        { id: 'usuarios', label: 'Administrar Usuarios', icon: Users },
    ];

    return (
        <aside className={`h-screen flex flex-col p-4 bg-zinc-50 dark:bg-[#202020] border-r border-zinc-200 dark:border-[#2e2e2e] select-none transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-[#2e2e2e]">
                <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${expanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
                    <span className="text-3xl">📦</span>
                    <h1 className="text-2xl font-bold tracking-tight dark:text-zinc-100">Vault</h1>
                </div>

                <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-zinc-200 dark:bg-[#2c2c2c] hover:bg-zinc-300 dark:hover:bg-[#3c3c3c] text-zinc-600 dark:text-zinc-300 transition-colors">
                    {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => (
                    <button key={item.id} onClick={() => setSeccionActual(item.id)} className={`group relative w-full flex items-center text-left gap-3 p-2.5 rounded-md text-sm font-medium transition-colors ${seccionActual === item.id
                        ? 'bg-zinc-200/50 dark:bg-[#2c2c2c] text-zinc-950 dark:text-zinc-50'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2c2c2c]'}`}>
                        <item.icon className="w-5 h-5 min-w-[20px]" />
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"}`}>
                            {item.label}
                        </span>
                        {!expanded && (
                            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-zinc-800 text-zinc-100 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="border-t border-zinc-200 dark:border-[#2e2e2e] pt-4 mt-4 flex items-center">
                <img
                    src={`https://ui-avatars.com/api/?name=${nombreUsuario}&background=27272a&color=f4f4f5&bold=true`}
                    alt="Avatar de usuario"
                    className="w-10 h-10 rounded-md min-w-[40px]"
                />
                <div className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${expanded ? "w-48 ml-3 opacity-100" : "w-0 opacity-0"}`}>
                    <div className="leading-4 truncate pr-2">
                        <h4 className="font-semibold text-sm dark:text-zinc-100 truncate">{nombreUsuario}</h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate block mt-0.5 capitalize">{rolUsuario}</span>
                    </div>
                    <button onClick={onLogout} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors" title="Cerrar Sesión">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};