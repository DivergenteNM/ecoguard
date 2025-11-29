import Link from 'next/link';
import { Home, Map, Bell, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    EcoGuard
                </h1>
                <p className="text-xs text-slate-400 mt-1">Guardia Ambiental Nacional</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg text-emerald-400 transition-colors">
                    <Home size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/dashboard/map" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <Map size={20} />
                    <span className="font-medium">Mapa de Riesgos</span>
                </Link>
                <Link href="/dashboard/alerts" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="font-medium">Alertas</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <Settings size={20} />
                    <span className="font-medium">Configuración</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full">
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
