'use client';

import { User, Bell, Shield, Palette, Globe, Database, Mail, Lock } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Configuración</h2>
                <p className="text-slate-500">Administra las preferencias y configuraciones del sistema</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Perfil de Usuario */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <User className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Perfil de Usuario</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                defaultValue="Usuario EcoGuard"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                defaultValue="usuario@ecoguard.gov.co"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                disabled
                            >
                                <option>Administrador</option>
                                <option>Analista</option>
                                <option>Observador</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Notificaciones</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Alertas de fenómenos</p>
                                <p className="text-xs text-slate-500">Recibir notificaciones de nuevos eventos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Reportes semanales</p>
                                <p className="text-xs text-slate-500">Resumen semanal por correo</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Actualizaciones del sistema</p>
                                <p className="text-xs text-slate-500">Notificaciones de mantenimiento</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" disabled />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Seguridad */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Seguridad</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña actual</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nueva contraseña</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                                disabled
                            />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            <p className="text-xs text-amber-800">Última actualización hace 45 días</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segunda fila de configuraciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Apariencia */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Palette className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Apariencia</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tema</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="px-4 py-2 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm transition-all" disabled>
                                    Claro
                                </button>
                                <button className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-all" disabled>
                                    Oscuro
                                </button>
                                <button className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-all" disabled>
                                    Auto
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Densidad de información</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                disabled
                            >
                                <option>Compacta</option>
                                <option>Normal</option>
                                <option>Espaciosa</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Animaciones</p>
                                <p className="text-xs text-slate-500">Efectos de transición en la interfaz</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Región y Datos */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Globe className="h-5 w-5 text-teal-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Región y Datos</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Departamento principal</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                disabled
                            >
                                <option>Nariño</option>
                                <option>Cauca</option>
                                <option>Putumayo</option>
                                <option>Valle del Cauca</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Zona horaria</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                disabled
                            >
                                <option>América/Bogotá (UTC-5)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Formato de fecha</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                disabled
                            >
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuración avanzada */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Database className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">Configuración Avanzada</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Frecuencia de actualización</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            disabled
                        >
                            <option>Tiempo real</option>
                            <option>Cada 5 minutos</option>
                            <option>Cada 15 minutos</option>
                            <option>Cada hora</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Caché de mapas</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            disabled
                        >
                            <option>Activado (500 MB)</option>
                            <option>Activado (1 GB)</option>
                            <option>Desactivado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nivel de detalle</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            disabled
                        >
                            <option>Alto</option>
                            <option>Medio</option>
                            <option>Bajo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
                <button className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors" disabled>
                    Cancelar
                </button>
                <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm" disabled>
                    Guardar cambios
                </button>
            </div>
        </div>
    );
}
