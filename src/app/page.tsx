import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import StatsSection from '@/components/home/StatsSection';
import InventorySection from '@/components/home/InventorySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import LocationSection from '@/components/home/LocationSection';
import TradeInSection from '@/components/home/TradeInSection';
import BrandsSection from '@/components/home/BrandsSection';
import { getFeaturedCars, getInventoryCars, getTestimonials, getBrands } from '@/services/api';
import { tenantConfig } from '@/config/tenant';

// ISR: Revalida a página a cada 1 hora, zerando chamadas desnecessárias à API
export const revalidate = 3600;

export default async function Home() {
  const featuredCars = await getFeaturedCars();
  const inventoryCars = await getInventoryCars();
  const testimonials = await getTestimonials();
  const brands = await getBrands();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: tenantConfig.name,
    description: 'Encontre os melhores veículos seminovos e usados com garantia e procedência.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenantConfig.contact.address,
      addressLocality: 'São Paulo', // Exemplo, deve vir do config se possível
      addressRegion: 'SP',
      addressCountry: 'BR'
    },
    telephone: tenantConfig.contact.whatsappRaw,
    image: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000' // Imagem de exemplo do showroom
    ]
  };

  return (
    <main className="flex flex-col flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='p-4'>
      <HeroSection inventoryCount={inventoryCars.length} brands={brands} />
      </div>
      <BrandsSection brands={brands} />
      <FeaturedSection cars={featuredCars} />
      <StatsSection />
      <InventorySection initialCars={inventoryCars} />
      <TradeInSection />
      <TestimonialsSection testimonials={testimonials} />
      <LocationSection />
    </main>
  );
}
