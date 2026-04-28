'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brand } from '@/types';

const BrandsSection = ({ brands }: { brands: Brand[] }) => {
    // Duplicamos as marcas para criar o efeito infinito sem gaps
    const displayBrands = [...brands, ...brands, ...brands, ...brands];

    if (!brands || brands.length === 0) return null;

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="pb-8 pt-4  relative overflow-hidden"
        >
            {/* Background Atmosphere (Sutil) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 w-full overflow-hidden">
                {/* Marquee Wrapper */}
                <div className="flex overflow-hidden group select-none">
                    <motion.div 
                        className="flex items-center gap-16 md:gap-24 whitespace-nowrap py-4"
                        animate={{
                            x: [0, -2000], 
                        }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {displayBrands.map((brand, idx) => (
                            <div 
                                key={`${brand.id}-${idx}`}
                                className="shrink-0 flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-110 group/item"
                            >
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="h-8 md:h-12 w-auto object-contain filter grayscale brightness-125 group-hover/item:grayscale-0 transition-all duration-500"
                                    />
                                ) : (
                                    <span className="text-white/50 text-xl font-bold uppercase tracking-[0.3em] group-hover/item:text-primary transition-colors">
                                        {brand.name}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Edge Fog Effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent pointer-events-none z-20" />
        </motion.section>
    );
};

export default BrandsSection;
