import { AlertTriangle, CloudRain, Droplets, Wind } from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        {
            id: 1,
            type: 'alert',
            title: 'Alerta de Deslizamiento',
            location: 'Municipio de Barbacoas',
            time: 'Hace 2 horas',
            icon: AlertTriangle,
            color: 'text-red-500 bg-red-50',
        },
        {
            id: 2,
            type: 'rain',
            title: 'Precipitación Alta Detectada',
            location: 'Tumaco',
            time: 'Hace 4 horas',
            icon: CloudRain,
            color: 'text-blue-500 bg-blue-50',
        },
        {
            id: 3,
            type: 'river',
            title: 'Aumento Nivel Río Mira',
            location: 'Tumaco',
            time: 'Hace 6 horas',
            icon: Droplets,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            id: 4,
            type: 'wind',
            title: 'Vientos Fuertes',
            location: 'Pasto',
            time: 'Hace 12 horas',
            icon: Wind,
            color: 'text-slate-500 bg-slate-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Actividad Reciente</h3>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                                <activity.icon size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">{activity.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{activity.location}</p>
                                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors">
                    Ver todo el historial
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
