import { Map } from 'lucide-react';

const MapPlaceholder = () => {
    return (
        <div className="bg-slate-100 rounded-xl border border-slate-200 h-[400px] flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 z-10 group-hover:scale-110 transition-transform duration-300">
                <Map size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 z-10">Vista Geoespacial</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs text-center z-10">
                El módulo de mapas interactivos estará disponible próximamente.
            </p>
            <button className="mt-6 px-6 py-2 bg-white text-emerald-600 text-sm font-medium rounded-full shadow-sm border border-slate-200 hover:shadow-md transition-all z-10">
                Explorar Demo
            </button>
        </div>
    );
};

export default MapPlaceholder;
