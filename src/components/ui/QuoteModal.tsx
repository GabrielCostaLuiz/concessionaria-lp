'use client';

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, MessageCircle, AlertCircle } from 'lucide-react';
import { Car } from '@/types';
import WhatsAppIcon from './WhatsAppIcon';
import { tenantConfig } from '@/config/tenant';
import { sendLead } from '@/services/api';

interface QuoteModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuoteModal({ car, isOpen, onClose }: QuoteModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        entry_value: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Helpers para formatação
    const formatPhone = (v: string) => {
        v = v.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        if (v.length > 5) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        if (v.length > 2) return v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        return v.replace(/^(\d*)/, '($1');
    };

    const formatCurrency = (v: string) => {
        const value = v.replace(/\D/g, '');
        const numberValue = Number(value) / 100;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numberValue);
    };

    // Reset state on open and lock scroll
    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setFormData({ name: '', email: '', phone: '', entry_value: 'R$ 0,00', message: '' });
            setErrors({});
            setServerError(null);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setServerError(null);

        // Se for um mock, simulamos sucesso (para evitar 422 no backend real)
        if (String(car.id).startsWith('mock-')) {
            setTimeout(() => {
                setLoading(false);
                setStep('success');
            }, 1000);
            return;
        }

        const entryValueNumeric = Number(formData.entry_value.replace(/\D/g, '')) / 100;

        try {
            const result = await sendLead({
                car_id: car.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, ''),
                entry_value: entryValueNumeric,
                message: formData.message
            });

            if (result.ok) {
                setStep('success');
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                }
                setServerError(result.error || 'Ocorreu um erro ao enviar sua solicitação.');
            }
        } catch (error) {
            setServerError('Erro de conexão. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const whatsappMessage = encodeURIComponent(`Olá! Gostaria de receber um orçamento para o veículo ${car.title}. Acabei de preencher meus dados no site da ${tenantConfig.name}.`);
    const whatsappUrl = `https://wa.me/${tenantConfig.contact.whatsappRaw}?text=${whatsappMessage}`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#0d0f14] w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500 flex flex-col">

                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-1">Solicitar Orçamento</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{car.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-8 pb-10">
                    {step === 'form' ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Preencha os campos abaixo para que nossa equipe comercial entre em contato com sua proposta personalizada.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {serverError && !Object.keys(errors).length && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle size={16} />
                                        <span>{serverError}</span>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nome completo"
                                        className={`w-full bg-white/[0.03] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all text-sm`}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 ml-2">{errors.name[0]}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <input
                                            required
                                            type="email"
                                            placeholder="Seu melhor e-mail"
                                            className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all text-sm`}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {errors.email && <p className="text-[10px] text-red-500 ml-2">{errors.email[0]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <input
                                            required
                                            type="tel"
                                            placeholder="WhatsApp"
                                            className={`w-full bg-white/[0.03] border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all text-sm`}
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                        />
                                        {errors.phone && <p className="text-[10px] text-red-500 ml-2">{errors.phone[0]}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-2 mb-1 block">Proposta de Entrada</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Valor de entrada (R$)"
                                        className={`w-full bg-white/[0.03] border ${errors.entry_value ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-mono`}
                                        value={formData.entry_value}
                                        onChange={e => setFormData({ ...formData, entry_value: formatCurrency(e.target.value) })}
                                    />
                                    {errors.entry_value && <p className="text-[10px] text-red-500 ml-2">{errors.entry_value[0]}</p>}
                                </div>

                                <div className="space-y-1">
                                    <textarea
                                        placeholder="Mensagem adicional (opcional)"
                                        rows={3}
                                        className={`w-full bg-white/[0.03] border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all text-sm resize-none`}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                    {errors.message && <p className="text-[10px] text-red-500 ml-2">{errors.message[0]}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-4 uppercase tracking-tight text-sm shadow-lg shadow-primary/15 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-[25deg]" />
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Enviar Proposta</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 flex gap-3 items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <ShieldCheck size={18} className="text-primary shrink-0" />
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    Seus dados estão seguros conosco. Usaremos suas informações apenas para o contato comercial referente a este veículo, respeitando a LGPD.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} />
                            </div>

                            <h2 className="text-2xl font-serif font-bold text-white mb-3">Solicitação Enviada!</h2>
                            <p className="text-gray-400 text-sm mb-10 px-4 leading-relaxed">
                                Obrigado, {formData.name.split(' ')[0]}! Recebemos seu interesse. <br />
                                {String(car.id).startsWith('mock-') && (
                                    <span className="text-[10px] text-primary/60 block mt-2 font-mono">(Simulação - Unidade Mock)</span>
                                )}
                                Nossa equipe entrará em contato em breve. <br />
                                Que tal adiantar o processo pelo WhatsApp?
                            </p>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/10 hover:-translate-y-1"
                            >
                                <WhatsAppIcon size={24} className="fill-white" />
                                Falar com Vendedor agora
                            </a>

                            <button
                                onClick={onClose}
                                className="mt-6 text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                Fechar e continuar navegando
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
