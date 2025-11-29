import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    color: 'emerald' | 'blue' | 'amber' | 'red';
}

const StatCard = ({ title, value, change, trend, icon: Icon, color }: StatCardProps) => {
    const colorStyles = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
                    <Icon size={24} />
                </div>
            </div>

            {change && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                        {change}
                    </span>
                    <span className="text-slate-400 ml-2">vs mes anterior</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
