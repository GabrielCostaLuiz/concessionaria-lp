# Blueprint: Landing Page Premium & Real-time (Laravel Reverb)

Este documento serve como especificação técnica (Prompt) para a criação de novas Landing Pages seguindo o padrão de alta performance e design de luxo implementado neste projeto.

---

## 🚀 1. Stack Tecnológica
- **Framework:** Next.js 14+ (App Router).
- **Linguagem:** TypeScript (Strict Mode).
- **Estilização:** CSS Vanilla com variáveis globais (Design System "Midnight Glass").
- **Animações:** Framer Motion (Transitions, Layout Morphing, Fade-ins).
- **Real-time:** Laravel Echo + Pusher JS (Conector Reverb).
- **Componentes Extra:** `react-number-format` (máscaras de moeda), `lucide-react` (ícones).

---

## 📡 2. Arquitetura de WebSockets (O Coração da Sincronização)

### Configuração do Echo
A conexão deve ser centralizada em um singleton (ex: `lib/echo.ts`):
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});
```

### Canal & Eventos (Ouvintes)
O Hook `useCarManager` deve ouvir o canal `catalog.{subdomain}` e processar os seguintes payloads:

| Evento | Payload (`e`) | Ação na UI |
| :--- | :--- | :--- |
| `.car.created` | `{ car: CarDTO }` | Inserir no topo do array de carros. |
| `.car.updated` | `{ car: CarDTO }` | Mapear e substituir o item antigo pelo novo no array. |
| `.car.deleted` | `{ carId: number }` | Filtrar array e remover o carro com ID correspondente. |
| `.car.image_added` | `{ carId, allImages }` | Atualizar apenas o campo `gallery` do veículo. |
| `.car.cover_changed` | `{ carId, newCoverUrl }` | Atualizar apenas o campo `image` principal (thumbnail). |

> [!IMPORTANT]
> **Comparação de IDs**: Sempre use `String(c.id) === String(e.carId)` para evitar falhas entre IDs numéricos (DB) e strings (JSON).

---

## 🛠️ 3. Contrato de API (Backend endpoints)
Base URL: `process.env.NEXT_PUBLIC_API_URL`
Header Obrigatório: `X-Tenant-Subdomain: {subdomain}`

- **Listagem de Estoque:** `GET /public/cars`
- **Itens em Destaque:** `GET /public/cars/featured`
- **Marcas & Filtros:** `GET /public/brands` e `GET /public/categories`
- **Envio de Lead:** `POST /leads` (campos: name, email, phone, car_id, entry_value)

---

## ✨ 4. Design & UX Guidelines (Midnight Glass)

### Estética
- **Background:** Escuro profundo (#0b0c10).
- **Cards:** Efeito de vidro com bordas brancas sutis e foco em néons (Verde Lima ou Azul).
- **Interação:** Cards devem ter um efeito de "levitação" (`hover:-translate-y-2`) e brilho suave.

### Performance (LCP)
- Imagens acima da dobra (Hero e primeiros 2 itens da grade) **DEVEM** usar a prop `priority` no Next.js.
- Helpler `fixImageUrl`: Criar função que substitui nomes de hosts internos (ex: `minio:9000`) por hosts externos (ex: `127.0.0.1:9000`) em tempo real.

---

## 📝 5. Prompt de IA para Gerar Nova LP
"Crie uma Landing Page Premium em Next.js para [NOME DO NICHO]. Use o Blueprint 'Midnight Glass' com sincronização Real-time via Laravel Echo. Implemente filtros de busca com máscaras de preços, grade animada com Framer Motion e integre os eventos de WebSocket `.car.updated` e `.car.deleted` para garantir que o catálogo nunca fique desatualizado sem refresh."
