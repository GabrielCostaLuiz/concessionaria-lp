'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    {
        value: '25',
        suffix: '+',
        label: 'Anos de Tradição',
    },
    {
        value: '10k',
        suffix: '+',
        label: 'Veículos Entregues',
    },
    {
        value: '100',
        suffix: '%',
        label: 'Garantia e Procedência',
    },
    {
        value: '99',
        suffix: '%',
        label: 'Clientes Satisfeitos',
    },
];

export default function StatsSection() {
    return (
        <section className="py-24 bg-background border-y border-white/5 relative overflow-hidden">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Number block */}
                            <div className="relative mb-6">
                                <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
                                    {stat.value}
                                    <span className="text-primary text-2xl md:text-3xl ml-1 align-top">
                                        {stat.suffix}
                                    </span>
                                </span>
                            </div>

                            {/* Divider - animating on hover maybe? */}
                            <div className="w-full h-px bg-white/10 mb-6 relative">
                                <motion.div 
                                    className="absolute inset-0 bg-primary h-full w-0 group-hover:w-full transition-all duration-700 mx-auto" 
                                />
                            </div>

                            {/* Label */}
                            <span className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-300">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
