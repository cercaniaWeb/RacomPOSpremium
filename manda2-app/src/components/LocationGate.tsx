'use client';
import React, { useState, useEffect } from 'react';
import { Truck, Store as StoreIcon, ChevronRight, Locate, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Store } from '@/lib/types';

interface LocationGateProps {
    onComplete: (mode: 'delivery' | 'pickup', location: string) => void;
}

export const LocationGate: React.FC<LocationGateProps> = ({ onComplete }) => {
    const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [stores, setStores] = useState<Store[]>([]);
    const [loadingStores, setLoadingStores] = useState(false);
    const [locating, setLocating] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchStores = async () => {
            setLoadingStores(true);
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('is_active', true);

            if (data) setStores(data);
            setLoadingStores(false);
        };
        fetchStores();
    }, []);

    const handleUseLocation = () => {
        setLocating(true);
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, we would reverse geocode here.
                // For now, we'll just show coordinates or a generic message
                setSelectedLocation(`Ubicación actual (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                setLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('No pudimos obtener tu ubicación. Por favor selecciona manualmente.');
                setLocating(false);
            }
        );
    };

    const handleSubmit = () => {
        if (selectedLocation) {
            onComplete(mode, selectedLocation);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 animate-in fade-in duration-500">
            <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Bienvenido</h1>
                <p className="text-gray-500 mb-8 text-lg">Para comenzar, verifica disponibilidad.</p>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                    <button
                        onClick={() => { setMode('delivery'); setSelectedLocation(''); }}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${mode === 'delivery' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                    >
                        <Truck className="w-4 h-4 mr-2" />
                        A Domicilio
                    </button>
                    <button
                        onClick={() => { setMode('pickup'); setSelectedLocation(''); }}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${mode === 'pickup' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                    >
                        <StoreIcon className="w-4 h-4 mr-2" />
                        Recoger (Pick Up)
                    </button>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    {mode === 'delivery' ? (
                        <div className="animate-in slide-in-from-bottom-2 fade-in space-y-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">¿Dónde te encuentras?</label>

                            <button
                                onClick={handleUseLocation}
                                disabled={locating}
                                className="w-full py-4 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center hover:bg-blue-100 transition-colors"
                            >
                                {locating ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Locate className="w-5 h-5 mr-2" />}
                                {locating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">O ingresa manualmente</span>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-lg outline-none focus:ring-2 focus:ring-[#556B2F]"
                                    placeholder="Escribe tu dirección..."
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-2 fade-in">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Elige tu sucursal más cercana</label>
                            <div className="relative">
                                <select
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-lg appearance-none outline-none focus:ring-2 focus:ring-[#556B2F]"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    disabled={loadingStores}
                                >
                                    <option value="">{loadingStores ? 'Cargando tiendas...' : 'Selecciona sucursal...'}</option>
                                    {stores.map(s => (
                                        <option key={s.id} value={s.name}>
                                            {s.name} {s.address ? `- ${s.address}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="safe-area-bottom">
                <button
                    onClick={handleSubmit}
                    disabled={!selectedLocation}
                    className="w-full bg-[#556B2F] text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                >
                    {mode === 'delivery' ? 'Confirmar Ubicación' : 'Seleccionar Tienda'}
                </button>
            </div>
        </div>
    );
};
