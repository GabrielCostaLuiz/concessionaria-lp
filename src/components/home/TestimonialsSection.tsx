'use client';

import { Testimonial } from '@/types';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { motion } from 'framer-motion';

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
    // Duplicamos os depoimentos para criar o efeito de loop infinito sem gaps
    const doubledTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section id="avaliacoes" className="py-24 relative overflow-hidden bg-linear-to-b from-background via-surface/10 to-background border-b border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                            Vozes de quem <span className="text-primary italic">Confia</span>
                        </h2>
                        <p className="text-gray-500 mt-6 max-w-2xl text-base md:text-lg font-medium">
                            A satisfação dos nossos clientes é o combustível que nos move a buscar sempre a excelência em cada detalhe.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col gap-2 max-w-[2000px] mx-auto">
                    {/* Row 1: Right to Left */}
                    <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-2">
                        <motion.div 
                            animate={{ x: [0, -1920] }}
                            transition={{ 
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 40,
                                    ease: "linear"
                                }
                            }}
                            className="flex gap-8 pr-8"
                        >
                            {doubledTestimonials.map((t, idx) => (
                                <TestimonialCard key={`test-up-${t.id}-${idx}`} testimonial={t} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2: Left to Right */}
                    <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-8">
                        <motion.div 
                            animate={{ x: [-1920, 0] }}
                            transition={{ 
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 50,
                                    ease: "linear"
                                }
                            }}
                            className="flex gap-8 pr-8"
                        >
                            {doubledTestimonials.map((t, idx) => (
                                <TestimonialCard key={`test-down-${t.id}-${idx}`} testimonial={t} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

