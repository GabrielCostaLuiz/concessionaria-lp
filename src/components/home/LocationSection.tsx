"use client"

import { MapPin, Phone, MessageSquare, ExternalLink, Map as MapIcon, Clock, ChevronRight } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';
import { motion } from 'framer-motion';

export default function LocationSection() {
    // Simples lógica para mostrar "Aberto" ou "Fechado"
    const now = new Date();
    const hour = now.getHours();
    const isOpened = hour >= 9 && hour < 18;

    return (
        <section id="localizacao" className="py-24 relative overflow-hidden ">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Info (5 cols) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-12 xl:col-span-5 flex flex-col gap-10"
                    >
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 mb-6">
                                <div className={`w-2 h-2 rounded-full ${isOpened ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                    {isOpened ? 'Aberto Agora' : 'Fechado no Momento'} • <span className="text-gray-500">09:00 - 18:00</span>
                                </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                                Visite nosso <br /> <span className="text-primary italic">Showroom</span>
                            </h2>
                            <p className="text-gray-500 mt-6 text-base md:text-lg max-w-md leading-relaxed font-medium">
                                Um espaço exclusivo pensado para você escolher seu próximo veículo com todo conforto e segurança que merece.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            <motion.div 
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-5 p-6 rounded-3xl bg-white/2 border border-white/5 hover:border-primary/30 hover:bg-white/4 transition-all duration-300"
                            >
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                    <MapPin size={28} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <h4 className="text-white font-bold text-lg mb-0.5">Endereço</h4>
                                    <p className="text-gray-500 text-sm font-medium truncate group-hover:text-white transition-colors">
                                        {tenantConfig.contact.address}
                                    </p>
                                </div>
                                <ChevronRight className="ml-auto text-gray-700 group-hover:text-primary transition-colors" size={20} />
                            </motion.div>

                            <motion.div 
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-5 p-6 rounded-3xl bg-white/2 border border-white/5 hover:border-primary/30 hover:bg-white/4 transition-all duration-300"
                            >
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                    <Phone size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-white font-bold text-lg mb-0.5">Contato</h4>
                                    <p className="text-gray-500 text-sm font-medium group-hover:text-white transition-colors">
                                        {tenantConfig.contact.phoneFormatted}
                                    </p>
                                </div>
                                <ChevronRight className="ml-auto text-gray-700 group-hover:text-primary transition-colors" size={20} />
                            </motion.div>
                        </div>

                    </motion.div>

                    {/* Right Column: Map (7 cols) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-12 xl:col-span-7 relative group mt-8 xl:mt-0"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity" />
                        
                        <div className="relative h-[500px] md:h-[600px] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-3xl transform group-hover:scale-[1.01] transition-transform duration-500">
                            <iframe
                                src={tenantConfig.contact.googleMapsEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(0.6) invert(0.9) contrast(1.1) brightness(0.9)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            
                            {/* Glass UI Overlay on Map */}
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status da Loja</span>
                                    <span className="text-white font-bold">{isOpened ? 'Visitação aberta até as 18:00' : 'Loja fechada - Atendimento via WhatsApp'}</span>
                                </div>
                                <Clock size={24} className="text-white/20" />
                            </div>

                            {/* Inner Border Frame */}
                            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[40px]" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

