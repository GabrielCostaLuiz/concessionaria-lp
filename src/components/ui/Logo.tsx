import NextImage from 'next/image';
import { tenantConfig } from '@/config/tenant';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const dimensions = {
        sm: { h: 42, w: 63 },
        md: { h: 52, w: 78 },
        lg: { h: 100, w: 150 }
    }[size];

    return (
        <div className={`flex items-center ${className}`}>
            <NextImage
                src="/logo-final.png"
                alt={tenantConfig.name}
                width={720} // High quality for larger displays
                height={480}
                className="object-contain"
                style={{ height: dimensions.h, width: 'auto' }}
                priority
            />
        </div>
    );
}
