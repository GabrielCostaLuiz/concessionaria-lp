import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="group relative bg-surface/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl transition-all duration-500 hover:border-primary/20 hover:-translate-y-2 overflow-hidden w-[350px] md:w-[400px] shrink-0">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < testimonial.rating ? "currentColor" : "none"}
                                strokeWidth={i < testimonial.rating ? 0 : 2}
                                className={i < testimonial.rating ? "text-primary fill-primary drop-shadow-[0_0_8px_rgba(174,195,81,0.5)]" : "text-white/10"}
                            />
                        ))}
                    </div>
                    <Quote size={32} className="text-primary/20 group-hover:text-primary transition-colors duration-500 transform group-hover:rotate-12" />
                </div>

                <blockquote className="text-white/80 text-lg md:text-xl font-serif italic leading-relaxed mb-8 grow line-clamp-4">
                    "{testimonial.text}"
                </blockquote>

                <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-hover flex items-center justify-center text-black font-black text-lg border-2 border-white/10 shadow-xl">
                        {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-base tracking-tight">{testimonial.name}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-primary/60">Cliente Satisfeito</span>
                    </div>
                </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />
        </div>
    );
}

