import { useEffect, useState } from 'react';
import { echo } from '@/lib/echo';
import { mapCarFromApi, fixImageUrl } from '@/services/api';
import { Car } from '@/types';

/**
 * Hook para sincronização em tempo real do catálogo de veículos
 * @param initialCars Lista inicial de carros vinda do SSR ou Fetch inicial
 * @param tenantSubdomain Subdomínio do tenant para identificar o canal
 */
export function useCarCatalogSocket(initialCars: Car[], tenantSubdomain: string) {
    const [cars, setCars] = useState<Car[]>(initialCars);

    useEffect(() => {
        // Se o Echo não estiver disponível (SSR), não faz nada
        if (!echo) return;

        // Canal dinâmico por Loja (Tenant) - Usando o subdomínio como identificador
        const channel = echo.channel(`catalog.${tenantSubdomain}`);

        console.log(`[SOCKET] Sintonizado: catalog.${tenantSubdomain}`);

        // Helper para lidar com novos carros/atualizações completas
        const handleUpsert = (apiCar: any) => {
            if (!apiCar) return;
            const mappedCar = mapCarFromApi(apiCar);
            setCars(prev => {
                const exists = prev.some(c => String(c.id) === String(mappedCar.id));
                if (exists) {
                    console.log(`[SOCKET] Atualizando carro existente: ${mappedCar.id}`);
                    return prev.map(c => String(c.id) === String(mappedCar.id) ? mappedCar : c);
                }
                console.log(`[SOCKET] Adicionando novo carro: ${mappedCar.id}`);
                return [mappedCar, ...prev];
            });
        };

        // Helper para deletar carros
        const handleDelete = (carId: any) => {
            const idToFilter = String(carId);
            setCars(prev => prev.filter(c => String(c.id) !== idToFilter));
        };

        // --- 1. NOVO CARRO CRIADO ---
        channel.listen('.car.created', (e: any) => {
            console.log('⚡ Evento .car.created:', e);
            handleUpsert(e.car || e);
        });
        channel.listen('App.Events.CarCreated', (e: any) => {
            console.log('⚡ Evento App.Events.CarCreated:', e);
            handleUpsert(e.car || e);
        });

        // --- 2. CARRO ATUALIZADO (Geral) ---
        channel.listen('.car.updated', (e: any) => {
            console.log('⚡ Evento .car.updated:', e);
            handleUpsert(e.car || e);
        });
        channel.listen('App.Events.CarUpdated', (e: any) => {
            console.log('⚡ Evento App.Events.CarUpdated:', e);
            handleUpsert(e.car || e);
        });

        // --- 3. CARRO DELETADO ---
        channel.listen('.car.deleted', (e: any) => {
            console.log('⚡ Evento .car.deleted:', e);
            handleDelete(e.carId || e.id);
        });
        channel.listen('App.Events.CarDeleted', (e: any) => {
            console.log('⚡ Evento App.Events.CarDeleted:', e);
            handleDelete(e.carId || e.id);
        });

        // --- 4. NOVA FOTO ENVIADA ---
        const handleImageAdded = (e: any) => {
            console.log('⚡ Evento Foto Adicionada:', e);
            const carId = e.carId || e.id;
            const images = e.allImages || e.car?.images;
            if (!carId || !images) return;

            setCars(prev => prev.map(c => 
                String(c.id) === String(carId) 
                ? { 
                    ...c, 
                    images: images,
                    gallery: images?.map((img: any) => fixImageUrl(img.url)) || []
                  } 
                : c
            ));
        };
        channel.listen('.car.image_added', handleImageAdded);
        channel.listen('App.Events.CarImageAdded', handleImageAdded);

        // --- 5. TROCA DE CAPA (THUMBNAIL) ---
        const handleCoverChanged = (e: any) => {
            console.log('⚡ Evento Capa Alterada:', e);
            const carId = e.carId || e.id || e.car?.id;
            const newUrl = e.newCoverUrl || e.cover_url || e.car?.main_image;
            if (!carId || !newUrl) return;

            setCars(prev => prev.map(c => 
                String(c.id) === String(carId) ? { ...c, image: fixImageUrl(newUrl) } : c
            ));
        };
        channel.listen('.car.cover_changed', handleCoverChanged);
        channel.listen('App.Events.CarCoverChanged', handleCoverChanged);

        return () => {
            console.log(`[SOCKET] Desconectando: catalog.${tenantSubdomain}`);
            if (echo) {
                channel.stopListening('.car.created')
                       .stopListening('App.Events.CarCreated')
                       .stopListening('.car.updated')
                       .stopListening('App.Events.CarUpdated')
                       .stopListening('.car.deleted')
                       .stopListening('App.Events.CarDeleted')
                       .stopListening('.car.image_added')
                       .stopListening('App.Events.CarImageAdded')
                       .stopListening('.car.cover_changed')
                       .stopListening('App.Events.CarCoverChanged');
                echo.leaveChannel(`catalog.${tenantSubdomain}`);
            }
        };
    }, [tenantSubdomain]);

    // Atualiza a lista local se a lista inicial (vinda de filtros/pesquisa) mudar
    useEffect(() => {
        setCars(initialCars);
    }, [initialCars]);

    return { cars, setCars };
}
