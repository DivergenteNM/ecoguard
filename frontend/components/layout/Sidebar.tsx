'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Bell, Settings, LogOut, AlertTriangle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/dashboard/map', icon: Map, label: 'Mapa de Riesgos' },
        { href: '/dashboard/fenomenos', icon: AlertTriangle, label: 'Fenómenos' },
        { href: '/dashboard/municipios', icon: MapPin, label: 'Municipios' },
        { href: '/dashboard/alerts', icon: Bell, label: 'Alertas' },
        { href: '/dashboard/settings', icon: Settings, label: 'Configuración' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    EcoGuard
                </h1>
                <p className="text-xs text-slate-400 mt-1">Guardia Ambiental Nacional</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-slate-800 text-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
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
