'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';

export default function PrivacyModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenPrivacyModal');
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500); // Aparece 1.5s após entrar para não ser invasivo no mobile
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            localStorage.setItem('hasSeenPrivacyModal', 'true');
        }, 600); // Tempo da animação de saída
    };

    if (!isOpen) return null;

    return (
        <div className={`
            fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-8 z-[10000]
            ${isClosing
                ? 'animate-out slide-out-to-bottom-10 fade-out duration-700 ease-in-out fill-mode-forwards'
                : 'animate-in slide-in-from-bottom-10 fade-in duration-700 ease-in-out'}
        `}>
            {/* Aviso Flutuante e Não-Bloqueante */}
            <div className="relative w-full md:w-[420px] bg-[#111318]/95 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[1.5rem] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-start gap-4 ring-1 ring-primary/20">

                {/* Ícone de Destaque Compacto (Verde para Segurança) */}
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group shadow-lg shadow-emerald-500/5">
                    <ShieldCheck size={20} className="text-emerald-500" />
                </div>

                <div className="flex-1 pr-4">
                    <h3 className="text-white text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        Compromisso <span className="text-emerald-500 italic font-bold text-[15px]">Privacidade</span>
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        <strong className="text-white italic">Foco em LGPD:</strong> Seus dados são protegidos por criptografia e usados apenas para contato comercial. <span className="text-emerald-500 font-bold underline decoration-emerald-500/30">Não realizamos consultas de crédito automáticas.</span>
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-tight shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                        Entendido
                    </button>
                </div>

                {/* Botão Fechar Rápido */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-600 hover:text-white hover:bg-white/5 transition-all transition-colors"
                >
                    <X size={14} />
                </button>

                {/* Ambient Glow Subtle */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 blur-2xl rounded-full pointer-events-none" />
            </div>
        </div>
    );
}
