import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, CheckCircle2, Factory, ShieldCheck, Car as CarIcon, ArrowLeft, Share2, Heart, Info, Settings, Zap } from "lucide-react";
import { getCarById } from "@/services/api";
import DistributedGallery from "@/components/ui/DistributedGallery";
import { tenantConfig } from "@/config/tenant";
import CarActions from "@/components/features/CarActions";
import CarCard from "@/components/ui/CarCard";
import Header from "@/components/layout/Header";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const car = await getCarById(resolvedParams.id);

    if (!car) {
        return { title: `Veículo não encontrado | ${tenantConfig.name}` };
    }

    return {
        title: `${car.title} - ${tenantConfig.name}`,
        description: car.description,
    };
}

export default async function CarDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    let car = await getCarById(resolvedParams.id);

    if (!car) {
        // Fallback para demonstração
        car = {
            id: 'mock-1',
            title: 'Porsche 911 Carrera S',
            price: 850000,
            image: 'https://images.unsplash.com/photo-1503376712341-2673ae0f9408?auto=format&fit=crop&q=80&w=1200',
            gallery: [
                'https://images.unsplash.com/photo-1503376712341-2673ae0f9408?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1517672791491-d306b3bc4f8b?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'
            ],
            badge: 'Destaque',
            category_name: 'Esportivo',
            description: 'Este icônico Porsche 911 combina performance racy com o luxo de um daily driver. Perfeito em cada detalhe, revisado e pronto para acelerar.',
            features: [
                'Bancos Sport Plus com 18 vias',
                'Sistema de Som Burmester 3D',
                'Eixo traseiro direcional',
                'Escapamento esportivo Sport Chrono',
                'Lanternas Exclusive Design',
                'Rodas RS Spyder Design'
            ],
            year: '2023/2023',
            mileage: '12.500 km',
            fuel: 'Gasolina P.',
            transmission_type_label: 'PDK 8 Velocidades',
            brand_name: 'Porsche',
            car_model_name: '911 Carrera',
            category: 'esportivo'
        } as any;
    }

    const carData = car!;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(carData.price);

    const allImages = carData.gallery && carData.gallery.length > 0 ? carData.gallery : [carData.image];

    // Schema.org JSON-LD (mantido conforme original)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: carData.title,
        image: allImages,
        description: carData.description || `Veículo ${carData.title} seminovo na ${tenantConfig.name}`,
        vehicleConfiguration: carData.features?.join(', '),
        driveWheelConfiguration: carData.category,
        modelDate: carData.year,
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: carData.mileage.replace(/\D/g, ''),
            unitCode: 'KMT'
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            price: carData.price,
            itemCondition: 'https://schema.org/UsedCondition',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: tenantConfig.name
            }
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-background pb-20">
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb / Top Bar */}
            <div className="max-w-[1440px] mx-auto px-6 w-full pt-32 pb-8 flex items-center justify-between">
                <a href="/#estoque" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Voltar ao estoque</span>
                </a>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
                        <Share2 size={18} />
                    </button>
           
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">

                {/* Left Column (8 cols): Gallery & Description */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <DistributedGallery images={allImages} />

                    {/* Content Section - Stacked Layout for better readability */}
                    <div className="flex flex-col gap-8 mt-4 w-full">
                        <div className="flex flex-col gap-6 p-10 bg-white/2 border border-white/5 rounded-[40px] backdrop-blur-sm">
                            <div className="flex items-center gap-3 text-primary">
                                <Info size={24} />
                                <h2 className="text-xl font-bold text-white">Sobre o Veículo</h2>
                            </div>
                            <p className="text-gray-500 leading-relaxed text-base font-medium">
                                {carData.description || 'Nenhuma descrição detalhada fornecida para este veículo.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 p-10 bg-white/2 border border-white/5 rounded-[40px] backdrop-blur-sm">
                            <div className="flex items-center gap-3 text-primary">
                                <Settings size={24} />
                                <h2 className="text-xl font-bold text-white">Equipamentos</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col items-center justify-center gap-2 text-center">
                                    <ShieldCheck size={28} className="text-primary mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Certificação</span>
                                    <span className="text-sm text-white font-bold">Garantia de 1 Ano</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col items-center justify-center gap-2 text-center">
                                    <CheckCircle2 size={28} className="text-primary mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Procedência</span>
                                    <span className="text-sm text-white font-bold">Laudo 100% Aprovado</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-white/5" />

                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {carData.features?.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-4 text-gray-500 text-sm font-medium group/feat">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/feat:bg-primary transition-colors" />
                                        <span className="group-hover/feat:text-white transition-colors">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Column (4 cols): Sidebar Dashboard */}
                <div className="lg:col-span-4 relative group">
                    <div className="sticky top-32 bg-surface p-10 rounded-[40px] border border-white/5 flex flex-col gap-10 shadow-2xl overflow-hidden">
                        {/* Status / Badge */}
                        <div className="absolute top-0 right-0 p-8">
                             {carData.badge && (
                                <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                    {carData.badge}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 relative z-10">
                            <span className="text-primary text-[11px] font-black uppercase tracking-[0.3em]">{carData.brand_name}</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tighter leading-none mb-4">{carData.title}</h1>
                            <div className="text-5xl font-bold text-primary tracking-tighter">
                                {formattedPrice}
                            </div>
                        </div>

                        {/* Specs List Column (Cleaner than grid) */}
                        <div className="flex flex-col gap-6 border-y border-white/5 py-10">
                            <div className="flex items-center justify-between group/spec">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover/spec:bg-primary/20 group-hover/spec:text-primary transition-all">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Ano Fabricação</span>
                                </div>
                                <span className="text-white font-bold">{carData.year}</span>
                            </div>

                            <div className="flex items-center justify-between group/spec">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover/spec:bg-primary/20 group-hover/spec:text-primary transition-all">
                                        <Gauge size={20} />
                                    </div>
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Quilometragem</span>
                                </div>
                                <span className="text-white font-bold">{carData.mileage}</span>
                            </div>

                            <div className="flex items-center justify-between group/spec">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover/spec:bg-primary/20 group-hover/spec:text-primary transition-all">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Transmissão</span>
                                </div>
                                <span className="text-white font-bold">{carData.transmission_type_label || 'Automático'}</span>
                            </div>

                            <div className="flex items-center justify-between group/spec">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover/spec:bg-primary/20 group-hover/spec:text-primary transition-all">
                                        <Fuel size={20} />
                                    </div>
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Combustível</span>
                                </div>
                                <span className="text-white font-bold">{carData.fuel}</span>
                            </div>
                        </div>

                        {/* Warranty Box */}
                        <div className="bg-white/[0.02] rounded-3xl p-6 flex gap-4 border border-white/5 items-center">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <ShieldCheck className="text-primary" size={24} />
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed font-bold">
                                Vistoria cautelar <span className="text-white">100% aprovada</span> com garantia estendida inclusa.
                            </p>
                        </div>

                        <CarActions car={carData} />
                    </div>
                </div>
            </div>

            {/* Recomendações */}
            <div className="max-w-[1440px] mx-auto px-6 w-full mt-32 pt-20 border-t border-white/5">
                <div className="flex items-end justify-between mb-16">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em]">Mais Oportunidades</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tighter">Você também <span className="text-primary italic">pode gostar</span></h2>
                    </div>
                    {/* Optional: button to view full estoque */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CarCard 
                            key={`sug-${i}`} 
                            car={{
                                id: `sug-${i}`,
                                title: i % 2 === 0 ? 'BMW X6 M' : 'Audi RS6 Avant',
                                price: 850000 + (i * 50000),
                                image: i % 2 === 0 ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1503376712341-2673ae0f9408?auto=format&fit=crop&q=80&w=800',
                                gallery: [],
                                badge: i === 0 ? 'Destaque' : '',
                                category_name: 'Premium',
                                year: '2023',
                                mileage: '15.000 km',
                                fuel: 'Gasolina',
                                transmission_type_label: 'Auto',
                                description: '',
                                category: 'esportivo',
                                brand_name: '',
                                car_model_name: ''
                            } as any}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
