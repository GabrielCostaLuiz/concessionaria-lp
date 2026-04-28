import Link from 'next/link';
import { CarFront, ArrowLeft } from 'lucide-react';
import { tenantConfig } from '@/config/tenant';
import Header from '@/components/layout/Header';

export default function NotFound() {
    return (
        <main className="flex flex-col flex-1 bg-background items-center justify-center text-center px-4 py-24 gap-8">
            <Header />
            <div className="bg-surface border border-white/5 rounded-2xl p-12 max-w-md w-full flex flex-col items-center gap-6 shadow-2xl mt-12">
                <div className="bg-primary/10 p-6 rounded-full">
                    <CarFront size={52} className="text-primary" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-7xl font-serif font-bold text-white">404</h1>
                    <p className="text-xl font-bold text-white">Veículo não encontrado</p>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1">
                        A página que você procura não existe ou o veículo foi vendido.
                        Que tal conferir nosso estoque completo?
                    </p>
                </div>

                <Link
                    href="/#estoque"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-black hover:text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-colors"
                >
                    <ArrowLeft size={18} />
                    Ver Estoque Completo
                </Link>

                <p className="text-xs text-gray-600">{tenantConfig.name}</p>
            </div>
        </main>
    );
}
