'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { Brand } from '@/types';
import { useRouter } from 'next/navigation';

export default function HeroSection({ inventoryCount, brands }: { inventoryCount: number, brands: Brand[] }) {
    const router = useRouter();
    const [category, setCategory] = useState('Todos');
    const [brandId, setBrandId] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const categories = ['Todos', 'SUV', 'Sedã', 'Hatch', 'Picape', 'Esportivo'];
    const priceOptions = [
        { label: 'Qualquer Preço', value: '' },
        { label: 'Até R$ 50k', value: '50000' },
        { label: 'Até R$ 100k', value: '100000' },
        { label: 'Até R$ 200k', value: '200000' },
        { label: 'Até R$ 500k', value: '500000' },
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (category !== 'Todos') params.append('category', category);
        if (brandId) {
            const brand = brands.find(b => b.id.toString() === brandId);
            if (brand) params.append('brand', brand.name);
        }
        if (maxPrice) params.append('maxPrice', maxPrice);

        router.push(`/#estoque?${params.toString()}`, { scroll: false });
        
        // Pequeno delay para garantir que o scroll ocorra após a navegação se necessário
        setTimeout(() => {
            const element = document.getElementById('estoque');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <section id="inicio" className=" h-[95vh] relative flex flex-col justify-center items-center  pb-20 overflow-hidden rounded-2xl">
            <Header />
            {/* Imagem de Fundo (Carro de Estúdio com Fade) */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-lighten"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, backgroundPosition: 'center 20%' }}
                />
                {/* Gradientes para mesclar a imagem ao fundo preto do site */}
                <div className="absolute inset-0 bg-linear-to-b from-background/75 via-transparent to-background/75" />
                <div className="absolute inset-0 bg-linear-to-r from-background/75 via-transparent to-background/75 opacity-80" />
                
                {/* Spotlights Suaves */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center mt-10">
                
                {/* Título Futurista / Arrojado */}
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-10 text-center tracking-widest uppercase" 
                    style={{ fontFamily: 'var(--font-sans)', fontStretch: 'expanded' }}
                >
                    Encontre o carro <br className="hidden md:block"/> dos sonhos
                </motion.h1>

                {/* Barra de Pesquisa Premium Glassmorphism */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 p-3 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-2 group transition-all duration-500 hover:border-white/20"
                >
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                        {/* Tipo de Carro */}
                        <div className="px-6 py-3 flex flex-col gap-1 hover:bg-white/5 transition-all group/item first:rounded-l-4xl relative">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Categoria</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none appearance-none cursor-pointer pr-6"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-surface text-white">{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none group-hover/item:translate-y-0.5 transition-transform" />
                            </div>
                        </div>

                        {/* Marca */}
                        <div className="px-6 py-3 flex flex-col gap-1 hover:bg-white/5 transition-all group/item relative">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Marca</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none appearance-none cursor-pointer pr-6"
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                >
                                    <option value="" className="bg-surface text-white">Todas as Marcas</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id} className="bg-surface text-white">{brand.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none group-hover/item:translate-y-0.5 transition-transform" />
                            </div>
                        </div>

                        {/* Preço */}
                        <div className="px-6 py-3 flex flex-col gap-1 hover:bg-white/5 transition-all group/item last:rounded-r-4xl relative">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Preço Máx.</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none appearance-none cursor-pointer pr-6"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                >
                                    {priceOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-surface text-white">{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none group-hover/item:translate-y-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Botão de Busca */}
                    <button 
                        onClick={handleSearch}
                        className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-background px-10 py-5 rounded-4xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 cursor-pointer"
                    >
                        <Search size={20} strokeWidth={3} />
                        Encontrar
                    </button>
                </motion.div>



            </div>
        </section>
    );
}
