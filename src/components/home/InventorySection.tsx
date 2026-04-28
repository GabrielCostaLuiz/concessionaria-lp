'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, Car, Truck, Flame, Gauge, Compass, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';
import { useSearchParams } from 'next/navigation';
import { Car as CarType } from '@/types';
import CarCard from '@/components/ui/CarCard';
import { useCarCatalogSocket } from '@/hooks/useCarCatalogSocket';
import { tenantConfig } from '@/config/tenant';

export default function InventorySection({ initialCars }: { initialCars: CarType[] }) {
    const { cars } = useCarCatalogSocket(initialCars, tenantConfig.subdomain);
    const searchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState({
        minYear: '',
        maxPrice: undefined as number | undefined,
        fuel: 'Todos'
    });

    // Sincroniza com parâmetros da URL (vindo da Hero ou outros links)
    useEffect(() => {
        const cat = searchParams.get('category');
        const brand = searchParams.get('brand');
        const price = searchParams.get('maxPrice');

        if (cat) {
            setSelectedCategory(cat);
        }
        if (brand) {
            setSearchTerm(brand);
        }
        if (price) {
            setFilters(prev => ({ ...prev, maxPrice: Number(price) }));
            setShowAdvancedFilters(true);
        }
    }, [searchParams]);

    const categories = [
        { name: 'Todos', icon: LayoutGrid },
        { name: 'SUV', icon: Compass },
        { name: 'Sedã', icon: Car },
        { name: 'Hatch', icon: Gauge },
        { name: 'Picape', icon: Truck },
        { name: 'Esportivo', icon: Flame },
    ];

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 30 }, (_, i) => currentYear - i);
    }, []);

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             car.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             car.car_model_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const catName = (car.category_name || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        
        const matchesCategory = selectedCategory === 'Todos' || 
                               catName === selCat ||
                               catName.includes(selCat.replace('ã', 'a')) ||
                               selCat.includes(catName.replace('an', 'a'));
        
        const matchesYear = !filters.minYear || parseInt(car.year) >= parseInt(filters.minYear);
        const matchesPrice = !filters.maxPrice || car.price <= filters.maxPrice;
        const matchesFuel = filters.fuel === 'Todos' || car.fuel === filters.fuel;
        
        return matchesSearch && matchesCategory && matchesYear && matchesPrice && matchesFuel;
    });

    const clearFilters = () => {
        setFilters({ minYear: '', maxPrice: undefined, fuel: 'Todos' });
        setSearchTerm('');
        setSelectedCategory('Todos');
    };

    const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'Todos' || filters.minYear !== '' || filters.maxPrice !== undefined || filters.fuel !== 'Todos';

    return (
        <section id="estoque" className="py-20  border-t border-white/5 relative">
            {/* Background Glow */}
            {/* <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" /> */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center gap-6 mb-12"
                >
                    <div className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                            Explore nosso <span className="text-primary italic">Estoque</span>
                        </h2>
                        <p className="text-gray-500 mt-5 max-w-2xl text-sm md:text-base font-medium mx-auto">
                            Veículos selecionados com rigoroso critério de qualidade e procedência para sua total segurança e satisfação.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <span className="text-white">{filteredCars.length}</span> Veículos Disponíveis
                        </span>
                    </div>
                </motion.div>

                {/* Filtros de Categoria (Modern Pills Centralizadas) */}
                <div className="mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map((cat, idx) => (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`group flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 border cursor-pointer ${
                                    selectedCategory === cat.name
                                    ? 'bg-primary text-black border-primary font-bold shadow-[0_10px_25px_-5px_rgba(174,195,81,0.4)]'
                                    : 'bg-white/3 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <cat.icon size={18} strokeWidth={selectedCategory === cat.name ? 2.5 : 2} />
                                <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                                    {cat.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Barra de Busca e Ações Rápidas */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10"
                >
                    <div className="md:col-span-9 relative grow group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-all duration-300" size={20} />
                        <input
                            type="text"
                            placeholder="Pesquise por marca, modelo ou caraterística..."
                            className="w-full bg-surface border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-white text-lg focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-700 font-medium shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    <div className="md:col-span-3 flex gap-3">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`grow border px-8 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 h-full ${
                                showAdvancedFilters || filters.minYear || filters.maxPrice || filters.fuel !== 'Todos'
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-surface border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <SlidersHorizontal size={20} />
                            <span>Filtrar</span>
                        </button>
                        
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-500 w-20 flex items-center justify-center rounded-3xl transition-all"
                                title="Limpar Filtros"
                            >
                                <RotateCcw size={20} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Painel de Filtros Avançados (Premium Design) */}
                <AnimatePresence>
                    {showAdvancedFilters && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl relative">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Ano Mínimo</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-surface border border-white/10 rounded-xl py-4 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                            value={filters.minYear}
                                            onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                                        >
                                            <option value="">Qualquer ano</option>
                                            {years.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <Gauge size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Preço Máximo</label>
                                    <div className="relative">
                                        <NumericFormat
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            placeholder="Ex: R$ 150.000"
                                            onValueChange={(values) => {
                                                setFilters({ ...filters, maxPrice: values.floatValue });
                                            }}
                                            value={filters.maxPrice}
                                            className="w-full bg-surface border border-white/10 rounded-xl py-4 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Combustível</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-surface border border-white/10 rounded-xl py-4 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                            value={filters.fuel}
                                            onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                                        >
                                            <option value="Todos">Todos</option>
                                            <option value="Gasolina">Gasolina</option>
                                            <option value="Flex">Flex</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Elétrico">Elétrico</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <Flame size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid de Veículos com Animação Reativa */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCars.map((car, idx) => (
                            <motion.div
                                layout
                                key={car.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CarCard car={car} priority={idx < 3} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* State: No Results */}
                {filteredCars.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24 text-gray-500 bg-white/5 rounded-3xl border border-white/5 mt-4"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="opacity-30" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Nenhum veículo encontrado</h3>
                        <p className="text-sm opacity-60">Ajuste seus filtros para encontrar o carro dos seus sonhos.</p>
                        <button 
                            onClick={clearFilters}
                            className="mt-6 text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                        >
                            Limpar todos os filtros
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
