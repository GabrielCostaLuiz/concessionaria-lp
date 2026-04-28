'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DistributedGalleryProps {
    images: string[];
}

export default function DistributedGallery({ images }: DistributedGalleryProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

    const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200';

    if (!images || images.length === 0) return null;

    const sideImages = images.slice(1, 5); // Pega até as próximas 4
    const remainingCount = images.length > 5 ? images.length - 5 : 0;

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleImageError = (index: number) => {
        setBrokenImages(prev => ({ ...prev, [index]: true }));
    };

    const getImageUrl = (index: number) => {
        return brokenImages[index] ? fallbackImage : images[index];
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[400px] md:h-[600px]">
                {/* Imagem Principal (Grande) */}
                <div 
                    className="md:col-span-3 relative rounded-3xl overflow-hidden border border-white/5 bg-surface group cursor-zoom-in"
                    onClick={() => openLightbox(0)}
                >
                    <Image 
                        src={getImageUrl(0)} 
                        alt="Foto principal" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        unoptimized
                        onError={() => handleImageError(0)}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white">
                            <Maximize2 size={24} />
                        </div>
                    </div>
                </div>

                {/* Laterais (4 pequenas ou 2x2) */}
                <div className="hidden md:grid grid-rows-4 gap-3">
                    {sideImages.map((img, idx) => {
                        const realIndex = idx + 1;
                        return (
                            <div 
                                key={idx}
                                className="relative rounded-2xl overflow-hidden border border-white/5 bg-surface group cursor-zoom-in"
                                onClick={() => openLightbox(realIndex)}
                            >
                                <Image 
                                    src={getImageUrl(realIndex)} 
                                    alt={`Foto ${idx + 2}`} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                    onError={() => handleImageError(realIndex)}
                                />
                                {idx === 3 && remainingCount > 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-2 backdrop-blur-[2px]">
                                        <span className="text-2xl font-bold">+{remainingCount}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Fotos</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {/* Placeholder se tiver poucas fotos */}
                    {sideImages.length < 4 && Array.from({ length: 4 - sideImages.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center">
                           <span className="text-gray-800 font-serif italic text-2xl tracking-tighter opacity-20">Premium</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Zoom */}
            {isLightboxOpen && (
                <div 
                    className="fixed inset-0 z-999 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button 
                        className="absolute top-8 right-8 text-white/50 hover:text-primary p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all z-1000 border border-white/10"
                        onClick={closeLightbox}
                    >
                        <X size={32} />
                    </button>

                    <button 
                        className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 hover:bg-primary text-white hover:text-black rounded-full flex items-center justify-center transition-all z-1000 border border-white/10 active:scale-90"
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <button 
                        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 hover:bg-primary text-white hover:text-black rounded-full flex items-center justify-center transition-all z-1000 border border-white/10 active:scale-90"
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
                    >
                        <ChevronRight size={40} />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                        <div className="relative w-full max-w-5xl h-full pointer-events-auto">
                            <Image 
                                src={getImageUrl(currentIndex)} 
                                alt={`Foto zoom ${currentIndex + 1}`} 
                                fill 
                                className="object-contain"
                                unoptimized
                                onError={() => handleImageError(currentIndex)}
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full text-white font-bold text-sm tracking-widest uppercase">
                       Foto {currentIndex + 1} de {images.length}
                    </div>
                </div>
            )}
        </div>
    );
}
