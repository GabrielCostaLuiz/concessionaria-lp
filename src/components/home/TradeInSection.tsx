'use client';

import { useState } from 'react';
import { CarFront, ArrowRight, CheckCircle2, ShieldCheck, Zap, Coins, ClipboardCheck } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';
import { motion } from 'framer-motion';

export default function TradeInSection() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section id="troca" className="py-24 relative overflow-hidden bg-linear-to-b from-background via-white/[0.015] to-background border-t border-white/5">
            {/* Ambient Light Enhancement */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Interactive Image Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full relative order-2 lg:order-1"
                    >
                        <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200"
                                alt="Veículo de luxo para troca"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black shrink-0 shadow-lg shadow-primary/20">
                                        <CarFront size={28} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg leading-tight mb-0.5 tracking-tight uppercase tracking-[0.05em]">Avaliação Premium</div>
                                        <div className="text-gray-400 text-xs font-medium">Transparência total em cada etapa do processo.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Static High-Impact Badge (replacing the bouncing one) */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-white p-6 md:p-8 rounded-[2.5rem] border-[8px] border-background flex flex-col items-center justify-center text-black shadow-2xl z-20"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Paga até</span>
                            <span className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">100%</span>
                            <div className="w-8 h-1 bg-primary my-2" />
                            <span className="text-[12px] font-bold uppercase tracking-widest text-primary">FIPE</span>
                        </motion.div>
                    </motion.div>

                    {/* Right: Text & Info Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 flex flex-col items-start order-1 lg:order-2"
                    >
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
                            Seu <span className="text-primary italic">usado</span> vale <br /> 
                            mais na {tenantConfig.name}
                        </h2>
                        
                        <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-xl">
                            Receba uma oferta justa e imediata pelo seu veículo. 
                            Utilize o crédito na troca pelo seu próximo seminovo com as melhores condições do mercado.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-12 w-full">
                            {[
                                { icon: Zap, text: "Avaliação em 15 minutos" },
                                { icon: ShieldCheck, text: "Laudo Cautelar Grátis" },
                                { icon: ClipboardCheck, text: "Troca com Troco" },
                                { icon: Coins, text: "Pagamento à Vista" }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className="flex items-center gap-4 group cursor-default"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col gap-6 w-full max-w-md"
                        >
                            <button
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="group bg-primary text-black font-black text-[11px] uppercase tracking-[0.25em] py-6 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(174,195,81,0.3)] flex items-center justify-center gap-4"
                            >
                                Iniciar Avaliação Online
                                <ArrowRight size={20} className={`transition-transform duration-500 ${isHovered ? 'translate-x-2' : ''}`} />
                            </button>
                            <div className="flex items-center gap-2 px-2 text-gray-700">
                                <ShieldCheck size={12} className="text-primary shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Atendimento sigiloso conforme LGPD</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
