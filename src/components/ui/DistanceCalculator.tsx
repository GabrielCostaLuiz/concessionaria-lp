'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Clock, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';

declare global {
    interface Window {
        google: any;
    }
}

export default function DistanceCalculator() {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        distance: string;
        duration: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Endereço de destino vindo do config
    const destination = tenantConfig.contact.address;

    const calculateDistance = () => {
        if (!address.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        // Verifica se a SDK do Google está carregada
        if (typeof window !== 'undefined' && !window.google) {
            setError('Google Maps API não carregada. Verifique sua chave de acesso em .env');
            setLoading(false);
            return;
        }

        try {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [address],
                    destinations: [destination],
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC,
                },
                (response: any, status: string) => {
                    if (status !== 'OK') {
                        setError('Erro ao calcular. Verifique o endereço digitado.');
                        setLoading(false);
                        return;
                    }

                    const element = response.rows[0].elements[0];
                    if (element.status === 'OK') {
                        setResult({
                            distance: element.distance.text,
                            duration: element.duration.text,
                        });
                    } else {
                        setError('Não foi possível traçar uma rota terrestre.');
                    }
                    setLoading(false);
                }
            );
        } catch (err) {
            console.error('Distance Matrix Error:', err);
            setError('Falha na comunicação com o Google Maps.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2rem] p-6 sm:p-8 mt-10 relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Navigation size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold leading-none mb-1.5">Calcule sua Rota</h4>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-black">Tempo real até a loja</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Digite seu ponto de partida (Ex: Rua Augusta, 100)"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40 transition-all text-sm"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && calculateDistance()}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" />
                    </div>

                    <button
                        onClick={calculateDistance}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-black font-black px-8 py-4 rounded-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-xs uppercase"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Calcular Agora'}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center italic">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 text-center group/item hover:border-primary/20 transition-all">
                            <Car size={16} className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">{result.distance}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Distância Total</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 text-center group/item hover:border-emerald-500/20 transition-all">
                            <Clock size={16} className="text-emerald-500" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">{result.duration}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Tempo Estimado</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                        Cálculo baseado no tráfego atual via Google Maps. Destino: <span className="text-white font-medium">{destination}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
