import { Car, Testimonial, LeadData, Brand } from '@/types';
import { tenantConfig } from '@/config/tenant';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Helper para fetch seguro que evita erros de parse de JSON quando o backend
 * retorna HTML (404, 500, etc) em vez de JSON. Injeta automaticamente os escopos de Tenant.
 */
async function safeFetchJson(endpoint: string, options: RequestInit = {}) {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
        
        const headers = new Headers(options.headers || {});
        headers.set('X-Tenant-Subdomain', tenantConfig.subdomain);
        headers.set('Accept', 'application/json');
        
        // Bypass Ngrok Browser Warning (necessário para deploys de teste na Vercel)
        headers.set('ngrok-skip-browser-warning', 'true');

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            console.error(`[API ERROR] ${options.method || 'GET'} ${endpoint} -> Status: ${response.status} ${response.statusText}`);
            try {
                // Tentamos capturar a mensagem de erro do Laravel (Tenants, etc)
                const errorData = await response.json();
                console.error(`[API ERROR DETAILS]`, JSON.stringify(errorData, null, 2));
            } catch (e) {
                // Se não for JSON, pode ser a página de erro HTML da Vercel ou Larave
            }
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn(`[API WARNING] Non-JSON response at ${endpoint} (${contentType})`);
            return null;
        }

        const result = await response.json();
        return result;
    } catch (e) {
        console.error(`[API NETWORK ERROR] Failed to reach ${endpoint}. Is the backend running at ${API_URL}?`, e);
        return null;
    }
}

/**
 * Helper para corrigir URLs do MinIO que usam host interno (Docker) para o host local
 */
export function fixImageUrl(url: string | undefined): string {
    const fallback = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800';
    if (!url) return fallback;
    
    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000';
    
    let newUrl = url;
    if (url.includes('minio:9000') || url.includes('localhost:9000')) {
        newUrl = url.replace(/https?:\/\/(minio|localhost):9000/g, minioEndpoint);
    }

    // Tenta garantir que caracteres especiais (espaços, etc) estejam codificados corretamente
    try {
        const urlObj = new URL(newUrl);
        urlObj.pathname = encodeURI(decodeURI(urlObj.pathname));
        newUrl = urlObj.toString();
    } catch (e) {
        // Se falhar o parse da URL, mantém a string como está
    }

    if (url.includes('minio:9000') && typeof window === 'undefined') {
        console.log(`[MINIO FIX] ${url} -> ${newUrl}`);
    }
    
    return newUrl;
}

/**
 * Transforma o objeto de Carro do Backend para o formato esperado pelo UI do Frontend
 */
export function mapCarFromApi(apiCar: any): Car {
    if (!apiCar) return null as any;

    const isFeatured = apiCar.is_featured === true || apiCar.featured === true || apiCar.featured === 1;
    
    let badge: 'Destaque' | 'Reservado' | 'Vendido' | undefined = undefined;
    if (apiCar.status === 'sold') badge = 'Vendido';
    else if (apiCar.status === 'reserved') badge = 'Reservado';
    else if (isFeatured) badge = 'Destaque';

    // A imagem principal
    const mainImage = apiCar.images?.find((img: any) => img.is_main) || apiCar.images?.[0];
    const imageUrl = fixImageUrl(mainImage?.url);

    // Quilometragem segura
    const kmValue = Number(apiCar.km || 0);

    // Título inteligente: Garante "Honda City Hatch" mesmo se o nome vir vazio ou simplificado
    const brandName = apiCar.brand_name || apiCar.brand?.name || '';
    const carModelName = apiCar.car_model_name || apiCar.car_model?.name || '';
    let title = apiCar.name || '';
    
    if (!title || (brandName && !title.toLowerCase().includes(brandName.toLowerCase()))) {
        title = `${brandName} ${title || carModelName}`.trim();
    }

    return {
        ...apiCar,
        id: apiCar.id,
        title: title || 'Veículo Premium',
        price: Number(apiCar.price || 0),
        
        // UI Helpers
        image: imageUrl,
        gallery: apiCar.images?.map((img: any) => fixImageUrl(img.url)) || [],
        year: String(apiCar.year_model || apiCar.year || '2025'),
        mileage: kmValue === 0 ? '0km' : `${new Intl.NumberFormat('pt-BR').format(kmValue)} km`,
        fuel: apiCar.fuel_type_label || apiCar.fuel || 'Flex',
        badge,
        
        // Garantir campos aninhados
        brand: apiCar.brand || { id: 0, name: brandName },
        car_model: apiCar.car_model || { id: 0, name: carModelName },
        category: apiCar.category || { id: 0, name: apiCar.category_name || '' },
        category_name: apiCar.category_name || apiCar.category?.name || 'Geral'
    };
}

/**
 * Helper para extrair o array de carros de qualquer estrutura de resposta (paginada ou não)
 */
function unwrapCars(data: any): any[] {
    if (!data) return [];
    
    // Caso 1: [ ... ]
    if (Array.isArray(data)) return data;
    
    // Caso 2: { data: [ ... ] }
    if (data.data && Array.isArray(data.data)) return data.data;
    
    // Caso 3: { data: { data: [ ... ] } } (Paginação Laravel Resource)
    if (data.data?.data && Array.isArray(data.data.data)) return data.data.data;
    
    // Caso 4: { status: '...', data: [...] }
    if (data.status && Array.isArray(data.data)) return data.data;

    return [];
}

export async function getCarById(id: string | number): Promise<Car | undefined> {
    return MOCK_CARS.find(c => c.id === String(id));
}

export async function getFeaturedCars(): Promise<Car[]> {
    return MOCK_CARS.filter(c => c.is_featured);
}

export async function getInventoryCars(): Promise<Car[]> {
    return MOCK_CARS;
}

export async function getTestimonials(): Promise<Testimonial[]> {
    return [
        {
            id: '1',
            name: 'João Silva',
            text: 'Excelente atendimento! Comprei meu BMW e estou muito satisfeito com todo o processo, que foi super transparente e seguro.',
            rating: 5
        },
        {
            id: '2',
            name: 'Maria Santos',
            text: 'Ótima concessionária, preços justos e carros em perfeito estado. Recomendo de olhos fechados!',
            rating: 5
        },
        {
            id: '3',
            name: 'Carlos Oliveira',
            text: 'Comprei a Tucson e foi a melhor decisão. Processo rápido e entrega dentro do prazo combinado. Equipe nota 10.',
            rating: 5
        },
        {
            id: '4',
            name: 'Amanda Lima',
            text: 'Ótima experiência geral, desde o primeiro contato até a entrega do veículo. Transmitiram muita confiança.',
            rating: 4
        }
    ];
}

export async function getBrands(): Promise<Brand[]> {
    return MOCK_BRANDS;
}

export interface LeadResponse {
    ok: boolean;
    error?: string;
    errors?: Record<string, string[]>;
    data?: any;
}

export async function sendLead(data: LeadData): Promise<LeadResponse> {
    try {
        // Garantir que car_id seja inteiro e entry_value seja numérico
        const payload = {
            ...data,
            car_id: Number(data.car_id),
            entry_value: Number(data.entry_value)
        };

        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Tenant-Subdomain': tenantConfig.subdomain
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json().catch(() => null);

        if (response.ok) {
            return { ok: true, data: json?.data };
        }

        // Caso de erro de validação (422) ou outros erros 4xx/5xx
        return {
            ok: false,
            error: json?.message || 'Erro ao enviar. Tente novamente.',
            errors: json?.errors
        };
    } catch (e) {
        // Se o backend estiver offline ou erro de rede, tratamos como sucesso silencioso
        // (o lead será capturado via WhatsApp no modal de qualquer forma)
        console.warn('[sendLead] Erro de rede ou backend indisponível.', e);
        return { ok: true };
    }
}

// --- MOCK DATA PARA RESILIÊNCIA (FALLBACK) ---

const MOCK_BRANDS: Brand[] = [
    { id: 1, name: 'BMW', slug: 'bmw' },
    { id: 2, name: 'Audi', slug: 'audi' },
    { id: 3, name: 'Mercedes', slug: 'mercedes' },
    { id: 4, name: 'Porsche', slug: 'porsche' },
    { id: 5, name: 'Toyota', slug: 'toyota' },
    { id: 6, name: 'Honda', slug: 'honda' },
];

const MOCK_CARS: Car[] = [
    {
        id: 'mock-1',
        title: 'BMW M4 Competition',
        price: 589900,
        km: 12000,
        year: '2023',
        mileage: '12.000 km',
        fuel: 'Gasolina',
        transmission_type_label: 'Automático',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 1, name: 'BMW' },
        car_model: { id: 1, name: 'M4' },
        category_name: 'Esportivo'
    } as any,
    {
        id: 'mock-2',
        title: 'Porsche 911 Carrera S',
        price: 845000,
        km: 5000,
        year: '2022',
        mileage: '5.000 km',
        fuel: 'Gasolina',
        transmission_type_label: 'PDK',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 4, name: 'Porsche' },
        car_model: { id: 2, name: '911' },
        category_name: 'Esportivo'
    } as any,
    {
        id: 'mock-3',
        title: 'Toyota Corolla Cross XRE',
        price: 158000,
        km: 25000,
        year: '2023',
        mileage: '25.000 km',
        fuel: 'Flex',
        transmission_type_label: 'CVT',
        image: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        is_featured: false,
        brand: { id: 5, name: 'Toyota' },
        car_model: { id: 3, name: 'Corolla Cross' },
        category_name: 'SUV'
    } as any,
    {
        id: 'mock-4',
        title: 'Audi RS6 Avant',
        price: 920000,
        km: 8000,
        year: '2024',
        mileage: '8.000 km',
        fuel: 'Gasolina',
        transmission_type_label: 'Automático',
        image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 2, name: 'Audi' },
        car_model: { id: 4, name: 'RS6' },
        category_name: 'Esportivo'
    } as any,
    {
        id: 'mock-5',
        title: 'Mercedes-Benz G63 AMG',
        price: 1850000,
        km: 2000,
        year: '2024',
        mileage: '2.000 km',
        fuel: 'Gasolina',
        transmission_type_label: 'Automático',
        image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 3, name: 'Mercedes' },
        car_model: { id: 5, name: 'G63' },
        category_name: 'SUV'
    } as any,
    {
        id: 'mock-6',
        title: 'Audi Q8 Performance',
        price: 680000,
        km: 15000,
        year: '2023',
        mileage: '15.000 km',
        fuel: 'Gasolina',
        transmission_type_label: 'Automático',
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 2, name: 'Audi' },
        car_model: { id: 6, name: 'Q8' },
        category_name: 'SUV'
    } as any,
    {
        id: 'mock-7',
        title: 'Honda Civic Type R',
        price: 430000,
        km: 1500,
        year: '2024',
        mileage: '1.500 km',
        fuel: 'Gasolina',
        transmission_type_label: 'Manual',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        badge: 'Destaque',
        is_featured: true,
        brand: { id: 6, name: 'Honda' },
        car_model: { id: 7, name: 'Civic' },
        category_name: 'Esportivo'
    } as any
];
