import { Phone, Mail, MapPin, ArrowUpRight, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';
import Logo from '@/components/ui/Logo';

const InstagramIcon = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-[#050608] border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                    <div className="mb-8">
                        <Logo size="lg" />
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                        {tenantConfig.slogan}. A sua concessionária de confiança para veículos premium e seminovos com garantia absoluta e procedência comprovada.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href={tenantConfig.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-primary/20"
                            aria-label="Siga-nos no Instagram"
                        >
                            <InstagramIcon size={22} />
                        </a>
                        <a
                            href={tenantConfig.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-primary/20"
                            aria-label="Curta nossa página no Facebook"
                        >
                            <FacebookIcon size={22} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-8 text-lg">Acesso Rápido</h4>
                    <ul className="flex flex-col gap-4 text-sm text-gray-400">
                        <li>
                            <a href="/#estoque" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowUpRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                Estoque Completo
                            </a>
                        </li>
                        <li>
                            <a href="/#destaques" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowUpRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                Mais Procurados
                            </a>
                        </li>
                        <li>
                            <a href="/#avaliacoes" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowUpRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                Depoimentos
                            </a>
                        </li>
                        <li>
                            <a href="/painel" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowUpRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                Painel Admin
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-8 text-lg">Contato e Endereço</h4>
                    <ul className="flex flex-col gap-6 text-sm text-gray-400">
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                <Phone size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-600 mb-0.5 tracking-widest">Telefone</span>
                                <a href={`tel:${tenantConfig.contact.whatsappRaw}`} className="hover:text-primary transition-colors font-medium">{tenantConfig.contact.phoneFormatted}</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-600 mb-0.5 tracking-widest">E-mail</span>
                                <a href={`mailto:${tenantConfig.contact.email}`} className="hover:text-primary transition-colors font-medium">{tenantConfig.contact.email}</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                <MapPin size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-600 mb-0.5 tracking-widest">Localização</span>
                                <span className="font-medium text-gray-300 leading-snug">{tenantConfig.contact.address}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* SEÇÃO DE SELOS DE SEGURANÇA - RESPONSIVA (HORIZONTAL NO DESKTOP, EMPILHADA NO MOBILE) */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-10">
                    <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8 lg:gap-10 text-center lg:text-left">

                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                            {/* Google Safe Browsing */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-all duration-500 text-green-500">
                                    <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 4L6 12V22C6 33.1 13.7 43.4 24 46C34.3 43.4 42 33.1 42 22V12L24 4Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 23L21 29L33 17" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                                        <div className="w-4 h-4 bg-white shadow-sm rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
                                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Safe Browsing</span>
                                    </div>
                                    <span className="text-white text-base font-bold leading-none tracking-tight">Site 100% Seguro</span>
                                </div>
                            </div>

                            {/* SSL / Site Protegido */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <ShieldCheck size={22} className="text-primary" />
                                </div>
                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Compra Segura</div>
                                    <div className="text-white text-sm font-black uppercase leading-none tracking-tight transition-all group-hover:text-primary">Site Protegido</div>
                                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-1 italic">Certificado SSL</div>
                                </div>
                            </div>

                            {/* Google Reviews */}
                            <div className="hidden sm:flex flex-col items-center sm:items-end gap-2 group">
                                <div className="flex flex-col text-center sm:text-right">
                                    <div className="flex items-center justify-center sm:justify-end gap-1 mb-1">
                                        <span className="text-orange-500 font-bold text-[10px] uppercase mr-1">5.0</span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={8} className="text-orange-500 fill-orange-500" />
                                        ))}
                                    </div>
                                    <div className="text-white text-[10px] font-bold leading-none mb-1">Google Reviews</div>
                                    <div className="text-gray-500 text-[9px] font-medium leading-tight">Avaliações Reais</div>
                                </div>
                            </div>
                        </div>

                        {/* Monitoramento 24h - Agora Ultra Responsivo */}
                        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shrink-0 transition-opacity hover:opacity-80">
                            <div className="relative shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-75" />
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">SSL Monitorado 24h</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs text-gray-500 font-medium">
                    © {new Date().getFullYear()} <span className="text-primary">{tenantConfig.name}</span>. Todos os direitos reservados.
                </p>
                <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                    Desenvolvido com excelência por Antigravity
                </div>
            </div>
        </footer>
    );
}
