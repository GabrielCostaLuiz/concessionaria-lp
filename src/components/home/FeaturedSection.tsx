'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Car } from '@/types';
import CarCard from '@/components/ui/CarCard';
import { useCarCatalogSocket } from '@/hooks/useCarCatalogSocket';
import { tenantConfig } from '@/config/tenant';
import { motion } from 'framer-motion';

export default function FeaturedSection({ cars: initialCars }: { cars: Car[] }) {
    const { cars } = useCarCatalogSocket(initialCars, tenantConfig.subdomain);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filtrar apenas os em destaque da lista reativa
    const featuredCars = cars.filter(c => c.is_featured);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth > 768 ? clientWidth / 3 : clientWidth;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="destaques" className="py-20 relative overflow-hidden group/featured ">
            {/* Ambient Background Glow - High Contrast */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full pointer-events-none opacity-50" />

            <div className="w-full px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-start text-left"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                        Veículos em <span className="text-primary italic">Destaque</span>
                    </h2>
                </motion.div>

                {/* Nav Controls - Desktop */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="hidden md:flex items-center gap-3"
                >
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-xl bg-surface border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center active:scale-95 shadow-xl group/btn"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={24} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-xl bg-surface border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center active:scale-95 shadow-xl group/btn"
                        aria-label="Próximo"
                    >
                        <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Carousel Container */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
            >
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-12 px-6 md:px-12 no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                    {featuredCars.map((car, idx) => (
                        <div key={car.id} className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] snap-center">
                            <CarCard car={car} priority={idx < 2} />
                        </div>
                    ))}
                    <div className="flex-shrink-0 w-8" />
                </div>
            </motion.div>
        </section>
    );
}
