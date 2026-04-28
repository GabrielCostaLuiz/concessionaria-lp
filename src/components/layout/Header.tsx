'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Plus } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import Logo from '@/components/ui/Logo';
import { tenantConfig } from '@/config/tenant';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const path = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY.current;
            const scrollingDown = scrollDelta > 0;
            const pastThreshold = currentScrollY > 100;

            setIsScrolled(currentScrollY > 40);

            // Hide/Show header on scroll directional changes
            if (Math.abs(scrollDelta) > 5) {
                if (scrollingDown && pastThreshold) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out rounded-b-[4rem] max-w-[97.6vw] mx-auto
                ${isScrolled ? 'bg-black/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'bg-transparent'}
                px-6 sm:px-12 
                ${path === '/' ? (isScrolled ? 'py-2' : 'py-10') : 'py-2'}
            `}
        >
            <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo size="md" />
                    </Link>
                </div>

                {/* Middle: Centered Flat Navigation */}
                <nav className="sm:flex hidden items-center gap-8 text-sm font-medium">
                    {[
                        { label: 'Início', href: '/' },
                        { label: 'Destaques', href: '/#destaques' },
                        { label: 'Estoque', href: '/#estoque' },
                        { label: 'Serviços', href: '/#avaliacoes' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <a
                        href="/#estoque"
                        className="hidden sm:block bg-primary text-black font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Ver Estoque
                    </a>
              
                </div>
            </div>
        </header>
    );
}
