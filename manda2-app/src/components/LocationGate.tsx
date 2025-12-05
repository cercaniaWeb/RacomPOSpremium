'use client';
import React, { useState } from 'react';
import { Truck, Store, ChevronRight } from 'lucide-react';

const COLONIAS = [
    "Condesa, CDMX",
    "Roma Norte, CDMX",
    "Polanco, CDMX",
    "Del Valle, CDMX",
    "Narvarte, CDMX"
];

const SUCURSALES = [
    "Sucursal Roma (Orizaba 101)",
    "Sucursal Polanco (Masaryk 20)",
    "Sucursal Del Valle (Pilares 500)"
];

interface LocationGateProps {
    onComplete: (mode: 'delivery' | 'pickup', location: string) => void;
}

export const LocationGate: React.FC<LocationGateProps> = ({ onComplete }) => {
    const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
    const [selectedLocation, setSelectedLocation] = useState('');

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
                        <Store className="w-4 h-4 mr-2" />
                        Recoger (Pick Up)
                    </button>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    {mode === 'delivery' ? (
                        <div className="animate-in slide-in-from-bottom-2 fade-in">
                            <label className="block text-sm font-bold text-gray-700 mb-2">¿En qué colonia estás?</label>
                            <div className="relative">
                                <select
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-lg appearance-none outline-none focus:ring-2 focus:ring-[#556B2F]"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">Selecciona tu zona...</option>
                                    {COLONIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Solo mostramos zonas con cobertura actual.</p>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-2 fade-in">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Elige tu sucursal más cercana</label>
                            <div className="relative">
                                <select
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-lg appearance-none outline-none focus:ring-2 focus:ring-[#556B2F]"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">Selecciona sucursal...</option>
                                    {SUCURSALES.map(s => <option key={s} value={s}>{s}</option>)}
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
                    {mode === 'delivery' ? 'Verificar Cobertura' : 'Seleccionar Tienda'}
                </button>
            </div>
        </div>
    );
};
