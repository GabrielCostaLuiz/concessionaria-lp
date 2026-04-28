export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface CarImage {
    id: number;
    url: string;
    name: string;
    is_main: boolean;
}

export interface Car {
    id: number | string;
    name: string;
    price: number;
    km: number;
    year_manufacture: number;
    year_model: number;
    color: string;
    fuel_type: string;
    fuel_type_label: string;
    transmission_type: string;
    transmission_type_label: string;
    status: 'available' | 'sold' | 'reserved' | string;
    status_label: string;
    is_featured: boolean;
    brand_name: string;
    car_model_name: string;
    category_name: string;
    images: CarImage[];
    brand: { id: number; name: string };
    car_model: { id: number; name: string };
    category: { id: number; name: string };
    description?: string;
    features?: string[];

    // UI specific fields (mapped from API for convenience)
    title: string;
    image: string;
    gallery: string[];
    year: string;
    mileage: string;
    fuel: string;
    badge?: 'Destaque' | 'Reservado' | 'Vendido';
}

export interface Testimonial {
    id: string | number;
    name: string;
    text: string;
    rating: number;
}

export interface LeadData {
    car_id: string | number;
    name: string;
    email: string;
    phone: string;
    entry_value: number;
    message?: string;
}

export interface Brand {
    id: string | number;
    name: string;
    logo?: string;
    slug?: string;
}
