'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Gauge, Fuel, ClipboardList } from 'lucide-react';
import { Car } from '@/types';
import QuoteModal from './QuoteModal';

export default function CarCard({ car, priority = false }: { car: Car, priority?: boolean }) {
    const router = useRouter();
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState(car.image);

    // Sincroniza a imagem local quando a prop 'car.image' mudar (via WebSocket)
    useEffect(() => {
        setImgSrc(car.image);
    }, [car.image]);

    const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(car.price);

    const handleCardClick = () => {
        router.push(`/carros/${car.id}`);
    };

    const handleQuoteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuoteModalOpen(true);
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="bg-surface rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col group cursor-pointer relative border border-white/5 hover:border-primary/30 hover:-translate-y-2 h-full"
            >
                {/* Badge de Destaque Premium */}
                {car.badge === 'Destaque' && (
                    <div className="absolute top-4 left-4 z-20 flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary text-black shadow-[0_4px_20px_rgba(174,195,81,0.4)] border border-primary">
                        <span>{car.badge}</span>
                    </div>
                )}

                {/* Sticker de Valor (Baixo KM / Único Dono) */}
                <div className="absolute top-4 right-4 z-20">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest border border-white/10 shadow-lg">
                        {Number(car.mileage.replace(/\D/g, '')) < 30000 ? 'Baixo KM' : 'Único Dono'}
                    </span>
                </div>

                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden bg-black/20">
                    <Image
                        src={imgSrc}
                        alt={car.title}
                        fill
                        priority={priority}
                        unoptimized={true}
                        onError={() => setImgSrc(fallbackImage)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="px-6 pb-6 pt-2 flex flex-col grow relative z-10 -mt-8">
                    <div className="flex flex-col mb-4">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">
                            {car.category_name}
                        </span>
                        <h3 className="mt-3 text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors" title={car.title}>
                            {car.title}
                        </h3>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                            <Calendar size={12} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-300">{car.year}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                            <Gauge size={12} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-300 truncate w-full">{car.mileage}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                            <Fuel size={12} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-300">{car.fuel}</span>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Valor</span>
                            <div className="text-white font-bold text-xl tracking-tighter">
                                {formattedPrice}
                            </div>
                        </div>

                        <button
                            onClick={handleQuoteClick}
                            className="bg-primary hover:bg-primary-hover text-black px-5 py-3 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(174,195,81,0.3)] active:scale-95 group/btn"
                        >
                            <div className="flex items-center gap-2">
                                <ClipboardList size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Orçamento</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <QuoteModal
                car={car}
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
        </>
    );
}
