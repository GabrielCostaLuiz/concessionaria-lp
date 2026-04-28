import { MetadataRoute } from 'next';
import { getInventoryCars } from '@/services/api';
import { tenantConfig } from '@/config/tenant';

// Substitua pela URL real de produção quando deployar
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const cars = await getInventoryCars();

    const carEntries: MetadataRoute.Sitemap = cars.map(car => ({
        url: `${BASE_URL}/carros/${car.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...carEntries,
    ];
}
