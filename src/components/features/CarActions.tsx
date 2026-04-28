'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import QuoteModal from '@/components/ui/QuoteModal';
import { Car } from '@/types';
import { tenantConfig } from '@/config/tenant';

interface CarActionsProps {
    car: Car;
}

export default function CarActions({ car }: CarActionsProps) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(car.price);

    const whatsappMessage = encodeURIComponent(`Olá! Vi o veículo ${car.title} por ${formattedPrice} no site da ${tenantConfig.name} e tenho interesse.`);
    const whatsappUrl = `https://wa.me/${tenantConfig.contact.whatsappRaw}?text=${whatsappMessage}`;

    return (
        <div className="flex flex-col gap-3 mt-4">
            {/* Botão WhatsApp (Principal) */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-[0_0_30px_rgba(37,211,102,0.1)] hover:shadow-[0_0_40px_rgba(37,211,102,0.2)] hover:-translate-y-0.5"
            >
                <WhatsAppIcon size={24} className="fill-white" />
                Tenho Interesse
            </a>

            {/* Botão Orçamento (Premium/Glow) */}
            <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="relative overflow-hidden group flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-[#050608] font-black text-lg py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer shadow-xl shadow-primary/20 hover:shadow-primary/40"
            >
                {/* Shine Effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 pointer-events-none" />

                <ClipboardList size={22} className="relative z-10 transition-transform group-hover:scale-110" />
                <span className="relative z-10 uppercase tracking-tight">Solicitar Orçamento</span>
            </button>

            {/* Modal de Orçamento */}
            <QuoteModal
                car={car}
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
        </div>
    );
}
