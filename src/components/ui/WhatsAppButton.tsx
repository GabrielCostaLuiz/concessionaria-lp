import WhatsAppIcon from './WhatsAppIcon';
import { tenantConfig } from '@/config/tenant';

export default function WhatsAppButton() {
    const message = encodeURIComponent(`Olá! Vim pelo site da ${tenantConfig.name} e gostaria de mais informações.`);
    const url = `https://wa.me/${tenantConfig.contact.whatsappRaw}?text=${message}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold w-14 h-14 hover:w-40 rounded-full shadow-2xl shadow-[rgba(37,211,102,0.3)] hover:shadow-[rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 group overflow-hidden"
        >
            <WhatsAppIcon size={24} className="shrink-0 fill-white" />
            <span className="text-sm max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 whitespace-nowrap">
                Fale Conosco
            </span>
        </a>
    );
}
