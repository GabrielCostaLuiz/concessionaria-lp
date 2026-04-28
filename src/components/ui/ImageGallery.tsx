'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images }: { images: string[] }) {
    const [currentImages, setCurrentImages] = useState(images);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';

    const handleImageError = (index: number) => {
        if (currentImages[index] === fallbackImage) return;
        const newImages = [...currentImages];
        newImages[index] = fallbackImage;
        setCurrentImages(newImages);
    };

    const scrollTo = useCallback((index: number) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const width = container.clientWidth;
        container.scrollTo({ left: index * width, behavior: 'smooth' });
        setCurrentIndex(index);
    }, []);

    const handleNext = () => scrollTo((currentIndex + 1) % images.length);
    const handlePrev = () => scrollTo((currentIndex - 1 + images.length) % images.length);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleLightboxNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((currentIndex + 1) % images.length);
    };

    const handleLightboxPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && isLightboxOpen) {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }
            if (e.key === 'ArrowLeft' && isLightboxOpen) {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, images.length]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const width = container.clientWidth;
            const scrollLeft = container.scrollLeft;
            const index = Math.round(scrollLeft / width);
            if (index !== currentIndex && !isLightboxOpen) {
                setCurrentIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentIndex, isLightboxOpen]);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Imagem Principal Interativa via Scroll/Swipe */}
            <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0c0f] shadow-2xl group">

                <div
                    ref={scrollContainerRef}
                    onClick={() => openLightbox(currentIndex)}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-zoom-in"
                >
                    {currentImages.map((img, idx) => (
                        <div key={idx} className="min-w-full h-full relative snap-center shrink-0">
                            <Image
                                src={img}
                                alt={`Gallery image ${idx + 1}`}
                                fill
                                unoptimized={true}
                                className="object-cover"
                                onError={() => handleImageError(idx)}
                                priority={idx === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Overlays */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white flex items-center gap-2">
                        <Maximize2 size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Clique para Zoom</span>
                    </div>
                </div>

                {/* Navegação Flutuante e Imersiva */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white hover:text-black p-3 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 active:scale-95 cursor-pointer shadow-2xl z-20"
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white hover:text-black p-3 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 active:scale-95 cursor-pointer shadow-2xl z-20"
                            aria-label="Próxima foto"
                        >
                            <ChevronRight size={28} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-3 py-2 rounded-full backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary w-4' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Miniaturas Animadas */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {currentImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`relative h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${currentIndex === idx
                                ? 'border-primary opacity-100 scale-[1.03] shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                                : 'border-transparent opacity-40 hover:opacity-100 hover:scale-[1.01] bg-black/50'
                                }`}
                        >
                            <Image 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`} 
                                fill 
                                unoptimized={true} 
                                className="object-cover"
                                onError={() => handleImageError(idx)}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox / Zoom Portal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/5 transition-all z-[110]"
                        onClick={closeLightbox}
                    >
                        <X size={32} />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handleLightboxPrev}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-primary text-white hover:text-black rounded-full flex items-center justify-center transition-all z-[110] border border-white/10 group active:scale-95"
                                >
                                    <ChevronLeft size={36} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                    onClick={handleLightboxNext}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-primary text-white hover:text-black rounded-full flex items-center justify-center transition-all z-[110] border border-white/10 group active:scale-95"
                                >
                                    <ChevronRight size={36} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </>
                        )}

                        <div
                            className="relative w-full h-full animate-in zoom-in-95 duration-500"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={currentImages[currentIndex]}
                                alt={`Zoom view ${currentIndex + 1}`}
                                fill
                                unoptimized={true}
                                className="object-contain"
                                onError={() => handleImageError(currentIndex)}
                                priority
                            />
                        </div>

                        {/* Caption / Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white text-sm font-bold tracking-widest uppercase">
                            {currentIndex + 1} de {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

