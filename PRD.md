# PRD — Ecossistema Loopis

**Documento de Requisitos de Produto (as-is)** — obtido por engenharia reversa integral do código-fonte
das três aplicações do monorepo.

| Campo | Valor |
|---|---|
| Versão | 1.0 |
| Data | 2026-09-03 |
| Método | Engenharia reversa (leitura de 100% de rotas, stores, tipos, services, hooks e páginas) |
| Natureza | **As-is** — descreve o produto **como está implementado**, não o produto desejado |
| Base de código | `Loopis/` (painel), `Loopis-Client/` (PWA), `Loopis-landing-page/` (site) |
| Rastreabilidade | Cada requisito referencia `caminho/arquivo.tsx:linha` |
| Anexo | Inconsistências, bugs e código morto → [`PRD-ANEXO-INCONSISTENCIAS.md`](./PRD-ANEXO-INCONSISTENCIAS.md) |
| Notas de análise | [`NOTAS-ENGENHARIA-REVERSA.md`](./NOTAS-ENGENHARIA-REVERSA.md) |

### Convenções

- **`⏳ PENDENTE`** — ponto que depende de definição do Cliente. O comportamento atual é descrito
  factualmente; a regra oficial ainda não está decidida.
- **`ℹ️ SIMULADO`** — funcionalidade presente na interface, porém sem backend/integração real.
- Referências no formato `Loopis-Client/src/pages/CheckIn.tsx:78` apontam para o código-fonte.

### Sumário

1. [Visão Geral do Ecossistema & Arquitetura](#1-visão-geral-do-ecossistema--arquitetura)
2. [Matriz de Personas & Perfis de Acesso](#2-matriz-de-personas--perfis-de-acesso)
3. [Mapeamento Exaustivo de Funcionalidades & Jornadas](#3-mapeamento-exaustivo-de-funcionalidades--jornadas-de-usuário)
4. [Regras de Negócio Críticas](#4-regras-de-negócio-críticas)
5. [Inventário de Rotas, Endpoints & Entidades](#5-inventário-de-rotas-endpoints--entidades)
6. [Anexo A — Catálogo de Dados (mocks)](#6-anexo-a--catálogo-de-dados-mock)
7. [Anexo B — Pendências para definição com o Cliente](#7-anexo-b--pendências-para-definição-com-o-cliente)

---

## 1. Visão Geral do Ecossistema & Arquitetura

### 1.1 Proposta de valor implementada

O Loopis é um **hub de experiências urbanas com cashback próprio ("Loops") para Florianópolis**,
que conecta consumidores finais a quatro verticais de parceiros (restaurantes, tours, eventos e
locações), com jornada de descoberta, reserva/compra, pagamento (integral ou dividido) e fidelização.

Promessas expostas ao consumidor (`Loopis-Client/src/components/guest/AuthGateModal.tsx:118-137`):
- +50 Loops grátis no cadastro;
- cashback automático de até 25% por comanda fechada;
- divisão de conta facilitada (split via Pix).

Promessas expostas ao parceiro (`Loopis-landing-page/src/components/FeaturesSection.tsx:5-36`):
- modelo 100% baseado em sucesso (sem mensalidade, comissão sobre venda gerada);
- leitura de cupom fiscal por IA, sem integração com PDV;
- dashboard de métricas em tempo real, campanhas em horários ociosos, marketing segmentado e
  selo de parceiro recomendado.

### 1.2 Composição do ecossistema

| Aplicação | Pasta | Público | Papel no funil |
|---|---|---|---|
| **Landing Page** | `Loopis-landing-page/` | Restaurantes (B2B) | Topo de funil / captação de parceiro |
| **Painel Loopis** | `Loopis/` | Parceiros (4 verticais), Restaurante legado e Admin Loopis | Operação, gestão e back-office |
| **PWA Loopis** | `Loopis-Client/` | Consumidor final (B2C) | Descoberta, conversão, pagamento e fidelidade |

### 1.3 Arquitetura técnica (estado atual)

**Stack por aplicação** (idêntica nas três, `package.json` de cada pasta):

| Camada | Tecnologia |
|---|---|
| UI | React 19 + TypeScript ~6.0 |
| Build | Vite 8 (`vite.config.ts`) |
| Estilo | Tailwind CSS 4 via `@tailwindcss/vite` + tokens em `src/index.css` |
| Roteamento | `react-router-dom` 7 (`createBrowserRouter`) — apenas `Loopis` e `Loopis-Client` |
| Estado global | `zustand` + middleware `persist` |
| Animação | `framer-motion`; Ícones: `lucide-react` |
| Gráficos | `recharts` (painel) |
| QR Code | `qrcode.react` |
| Formulários | `react-hook-form` + `zod` (**apenas** em `Loopis`, no `PartnerWizard`) |
| Lint | `oxlint` |

**Design system** (`Loopis-Client/src/index.css:3-11`):

| Token | Valor |
|---|---|
| `--color-brand-deep-purple` | `#3D1E6D` |
| `--color-brand-violet` | `#7C3AED` |
| `--color-brand-lilac` | `#C4A1F5` |
| `--color-brand-graphite` | `#2B2B2E` |
| `--color-brand-off-white` | `#FAFAFC` |
| Fonte (apps) | `Inter` |
| Fonte (landing) | `Plus Jakarta Sans` |

Utilitários: `.bg-gradient-loopis` / `.text-gradient-loopis` (gradiente 135° roxo→violeta→lilás) e
`.glassmorphism` (blur 10px com variante dark automática via `prefers-color-scheme`).

### 1.4 Como as três aplicações se comunicam

**Não há comunicação entre elas.** O estado atual é de três SPAs independentes:

- **Não existe backend, API REST/GraphQL, autenticação de servidor ou variável de ambiente.**
  Não há nenhuma chamada `fetch`/`axios`, nem uso de `import.meta.env`/`VITE_*` no código de produção.
- A camada de serviço é `src/services/mockApi.ts`, um módulo em memória com latência simulada
  (`delay(ms)` de 250 a 750 ms) — `Loopis-Client/src/services/mockApi.ts:282`.
- A persistência é `localStorage` via `zustand/persist`, com a chave **`loopis-storage`**
  (`Loopis-Client/src/store/useStore.ts:1010`) e a chave auxiliar
  **`loopis-mock-partner-type`** (`Loopis/src/hooks/usePartnerContext.ts:16`).
- **Nenhuma das três aplicações contém link para as outras**: a landing não aponta para o PWA nem
  para o painel; o PWA não aponta para o painel e vice-versa.
- O compartilhamento de código é **por cópia de arquivos**, não por pacote: `store/useStore.ts`,
  `types/*`, `services/mockApi.ts`, `mocks/guestData.ts`, `hooks/useSplitPayment.ts`,
  `hooks/useOrderSummary.ts`, `hooks/useRestaurantBilling.ts`, `pages/ScannerPage.tsx`,
  `pages/OrderSummaryPage.tsx`, `pages/CheckoutSplitPage.tsx` e
  `pages/admin/RestaurantBillingSettingsPage.tsx` existem duplicados nos dois apps de produto.

**Pontos de integração previstos no código (URLs geradas, ainda sem destino real)** — `ℹ️ SIMULADO`:

| Origem | URL gerada | Destino esperado |
|---|---|---|
| Painel — emissor de comanda | `https://loopis.com.br/checkout/split?comanda={code}&total={valor}` | PWA — checkout | `Loopis/src/pages/restaurant/ManualEntry.tsx:117` |
| Painel — cobrança do Kanban | `https://app.loopis.com.br/pagar/{comandaId}/{ref}` | PWA — pagamento de fração | `Loopis/src/pages/partner/RestaurantKanbanView.tsx:262` |
| PWA — split | `{origin}/checkout/pay?ref={comanda}&p={participante}&amt={valor}` | PWA — pagamento de convidado | `Loopis-Client/src/hooks/useSplitPayment.ts:54` |
| Painel — onboarding | `https://loopis.com.br/autocadastro/parceiro-indica` | Autocadastro de parceiro | `Loopis/src/pages/restaurant/Onboarding.tsx:130` |
| PWA — amigos | `https://loopis.com.br/amigos/convite?ref=me` | Convite de amizade | `Loopis-Client/src/components/profile/FriendsModal.tsx:79` |

### 1.5 Característica mobile do PWA

O `Loopis-Client` é mobile-first: bottom navigation (`components/BottomNav.tsx`), bottom sheets
com `framer-motion`, área segura (`pb-safe`) e layout responsivo. **Não há `manifest.json`,
service worker ou ícones de instalação** — `Loopis-Client/index.html` carrega apenas fonte e
favicon; `public/` contém `favicon.svg`, `icons.svg` e imagens de restaurantes. O produto é,
portanto, uma **web app mobile-first, ainda não instalável**.

### 1.6 Diagrama lógico (estado atual)

```
┌────────────────────────┐   (sem link)   ┌────────────────────────┐
│  Loopis-landing-page   │  - - - - - - > │     Loopis-Client      │
│  Captação B2B          │                │     PWA do consumidor  │
│  RegisterModal (form)  │                │  localStorage:         │
│  → estado local        │                │  'loopis-storage'      │
└────────────────────────┘                └────────────────────────┘
                                                     ↑ (sem link)
                                                     ⋮
┌──────────────────────────────────────────────────────────────────┐
│                            Loopis                                │
│  /login  → Painel do Parceiro (adaptativo por PartnerType)       │
│          → Painel do Restaurante (legado)                        │
│          → Painel do Admin Loopis                                │
│  localStorage: 'loopis-storage' + 'loopis-mock-partner-type'     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Matriz de Personas & Perfis de Acesso

### 2.1 Modelo de papéis no código

```ts
// Loopis-Client/src/types/index.ts:1
export type ProfileRole = 'client' | 'restaurant' | 'admin';

// Loopis-Client/src/types/partner.ts:1-6
export const PartnerType = {
  RESTAURANT: 'restaurante',
  TOUR:       'tour',
  EVENT:      'evento',
  RENTAL:     'rental',
} as const;
```

### 2.2 Matriz consolidada

| # | Persona | App | Como entra | Rota inicial | Escopo de acesso |
|---|---|---|---|---|---|
| P1 | **Visitante (deslogado)** | PWA | estado inicial `isLoggedIn: false` (`Loopis-Client/src/store/useStore.ts:698`) | `/` | Navega em tudo; bloqueio só nos CTAs de reserva/compra |
| P2 | **Cliente logado** | PWA | `login()` em qualquer submit (`store/useStore.ts:702`) | `/` | Todas as rotas do PWA + chatbot + carteira + amigos |
| P3 | **Parceiro Restaurante** | Painel | Login → vertical "Restaurante / Bar" (`Loopis/src/pages/Login.tsx:57`) | `/admin/dashboard` | Menu comum + Gestão de Mesas & Reservas |
| P4 | **Parceiro Tour/Aventura** | Painel | Login → vertical "Tour / Aventura" | `/admin/dashboard` | Menu comum + Tours, Manifesto, Portaria, Guias/Embarcações |
| P5 | **Parceiro Evento/Festa** | Painel | Login → vertical "Evento / Festa" | `/admin/dashboard` | Menu comum + Eventos/Lotes, Portaria, Promoters |
| P6 | **Parceiro Locação/Quadras** | Painel | Login → vertical "Locação / Quadras" | `/admin/dashboard` | Menu comum + Ativos/Grade, Portaria, Manutenção/Clima |
| P7 | **Restaurante (painel legado)** | Painel | Login → aba "Cadastrar" (`Loopis/src/pages/Login.tsx:65`) | `/restaurante/onboarding` → `/restaurante/dashboard` | Dashboard, Reservas, Atividades, Lançar Comanda, Campanhas, Configurações, Comercial |
| P8 | **Admin Loopis (Super Admin)** | Painel | Botão "Entrar como Administrador Loopis" (`Loopis/src/pages/Login.tsx:73`) | `/admin/dashboard-admin` | Dashboard da rede, Aprovações, Parceiros, Clientes, Cobranças, Pontuação, Auditoria IA, Configurações Globais |

Personas presentes nos dados, mas **sem interface própria**: **Promoter** (vendedor externo com
cupom e comissão, gerido pelo parceiro de evento — `Loopis/src/pages/partner/EventPromotersCommissionView.tsx:4-13`),
**Guia/Embarcação** (recurso operacional do tour — `Loopis/src/pages/partner/TourGuidesFleetView.tsx:5-15`),
**Convidado do split** (paga por link/WhatsApp sem ter conta — `Loopis-Client/src/hooks/useSplitPayment.ts:47`).

### 2.3 Mecânica de controle de acesso implementada

| Aspecto | Implementação atual |
|---|---|
| Autenticação | **Inexistente.** `login()` apenas seta `isLoggedIn: true` (`Loopis-Client/src/store/useStore.ts:702`). No painel, os campos de e-mail/senha têm valores default e **não são lidos** (`Loopis/src/pages/Login.tsx:57-77`) |
| Autorização | **Inexistente.** Nenhuma rota possui guard (`Loopis/src/routes.tsx`, `Loopis-Client/src/routes.tsx`) |
| Identidade do parceiro | Hardcoded em `usePartnerContext` (`Loopis/src/hooks/usePartnerContext.ts:41-63`): `partnerId: 'partner-ost-001'`; nome/bairro derivados do tipo |
| Diferenciação de perfil | `localStorage['loopis-mock-partner-type']` → decide menu (`Loopis/src/constants/navigation.ts:126-129`) e conteúdo das telas |
| Sessão | `zustand/persist` em `localStorage`; `logout()` limpa `isLoggedIn`, papel e reserva ativa (`Loopis-Client/src/store/useStore.ts:703-708`) |

### 2.4 Menu por perfil de parceiro (navegação adaptativa)

Fonte: `Loopis/src/constants/navigation.ts:25-124`.

**Comum a todas as verticais** (`commonPartnerNavigation:25`):

| Item | Rota | Descrição no código |
|---|---|---|
| Visão Geral | `/admin/dashboard` | Métricas de GMV, vendas e conversão |
| Configurações da Conta | `/admin/dashboard/configuracoes` | Dados comerciais, repasses e operação |
| Clientes | `/admin/dashboard/clientes` | Histórico de participações e consumo |
| Avaliações | `/admin/dashboard/avaliacoes` | Moderação e publicação de comentários |

**Específico por vertical** (`partnerNavigationByType:53`):

| Vertical | Itens |
|---|---|
| `restaurante` | Gestão de Mesas & Reservas (`/mesas-reservas`) |
| `tour` | Meus Tours & Aventuras (`/agenda-saidas`), Manifesto de Passageiros (`/manifesto`), Validador de Portaria (`/portaria`), Guias e Embarcações (`/guias-equipamentos`) |
| `evento` | Meus Eventos & Festas (`/lotes-ingressos`), Validador de Portaria (`/portaria`), Promoters & Comissões (`/promoters`) |
| `rental` | Locações & Quadras (`/grade-horaria`), Validador de Portaria (`/portaria`), Manutenção / Clima (`/bloqueios`) |

---

## 3. Mapeamento Exaustivo de Funcionalidades & Jornadas de Usuário

## 3.A — Loopis-Client (PWA do consumidor)

### 3.A.1 Shell da aplicação

`MainLayout` (`Loopis-Client/src/layouts/MainLayout.tsx:9`) decide a composição:

| Condição | Header | Bottom Nav | Chatbot |
|---|---|---|---|
| Rota `/` (home) | renderizado pela própria página | só se logado | só se logado |
| Rota `/auth` | nenhum | não | não |
| Demais rotas, deslogado | `GuestHeader` (CTAs Entrar/Criar conta) | não | não |
| Demais rotas, logado | `Header` completo | sim (mobile) | sim |

Bottom Nav (`components/BottomNav.tsx:7-12`): **Início** `/` · **Experiências** `/experiencias` ·
**Reservas** `/reserva/checkin` · **Loops** `/carteira`.

Header logado (`components/Header.tsx:52-62`): Explorar, Experiências, Minhas Reservas, Meus Loops,
saldo em Loops, sino de notificações (`NotificationsMenu`), acesso ao modal de Amigos com badge de
convites pendentes e dropdown de perfil/sair.

### 3.A.2 Jornada do usuário **deslogado**

**Passo 1 — Chegada (`/` → `GuestLandingPage`)** — `pages/GuestLandingPage.tsx:87`

1. Header de visitante com "Entrar" e "Criar conta" (`GuestHeader`).
2. **Hero**: título "Floripa inteira em uma carteira de experiências", subtítulo citando reserva de
   mesa, ingresso, passeio, quadra/equipamento e divisão com amigos via Pix, WhatsApp e Loops.
   Selo dinâmico: deslogado → "+50 Loops no primeiro cadastro"; logado → "{saldo} Loops para usar hoje"
   (`pages/GuestLandingPage.tsx:230-233`).
3. CTAs do hero: "Ver opções" (âncora `#explorar`) e "Minha carteira" (`/carteira`).

**Passo 2 — Segmentação por intenção** (`pages/GuestLandingPage.tsx:40-46`)

Chips de vertical: `all` (Tudo em Floripa) · `restaurant` (Restaurantes/Comer) · `tour`
(Tours & Aventuras/Passear) · `event` (Eventos & Festas/Curtir) · `rental` (Locações/Alugar).
Quatro *journey cards* aplicam o mesmo filtro: "Jantar hoje", "Passeio na água", "Noite e eventos",
"Alugar por hora" (`:48-73`).

**Passo 3 — Busca** (`:181-190`): texto livre com match em título, subtítulo, bairro e nome do parceiro.

**Passo 4 — Feed de descoberta** (`:99-176`)

Montagem do feed unificado:

| Fonte | Quantidade | Mapeamento |
|---|---|---|
| `mockGuestRestaurants` | primeiros 4 | vertical `restaurant`, CTA "Reservar mesa", href `/restaurante/{id}` |
| `mockExperiences` | primeiras 7 | vertical inferida da `macroCategory`; CTA "Comprar ingresso" (evento) / "Escolher saída" (tour) / "Ver detalhes"; href `/experience/{id}` |
| Locações hardcoded | 2 (Arena Lagoa Beach Tennis R$90/h; Jet-ski Jurerê R$220/h) | vertical `rental`, href `/experience/rental-*` |

O primeiro item filtrado vira card destacado "Recomendado agora"; os demais entram em grade.
Cada card exibe bairro, nota, preço e **Loops estimados**
(`formatLoops = Math.round(price × cashbackPercent / 100)` — `:84-85`).

**Passo 5 — Espaços publicitários** (`components/guest/AdBannerSlot.tsx`)

| Tipo | Comportamento | Conteúdo |
|---|---|---|
| `hero` | carrossel automático a cada **6 s**, setas e indicadores (`AdBannerSlot.tsx:36-44`) | 3 banners (`mocks/guestData.ts:563`) |
| `interstitial` | banner único patrocinado | "Heineken & Eisenbahn Gourmet" (`mocks/guestData.ts:599`) |

Clique navega para `targetUrl` (rota interna via router, ou `window.open` se `http`).

**Passo 6 — Blocos de confiança** (`:76-89`): "Reserve e ganhe", "Divida com amigos", "Use sem atrito".

**Passo 7 — Gate de autenticação**

- `AuthGateModal` (`components/guest/AuthGateModal.tsx:14`) é acionado pelos CTAs do header
  (`header_login` / `header_register`) e traz a proposta de valor (+50 Loops, cashback até 25%,
  split via Pix). Ambos os botões abrem o `LoginModal`.
- Nos fluxos de conversão, o gate é aplicado no momento da ação:
  - `RestaurantDetails.handleBookingClick` (`pages/RestaurantDetails.tsx:56`) — botão muda para
    "Cadastre-se para Reservar";
  - `ExperienceBookingModal.handleProcessPayment` (`components/experiences/ExperienceBookingModal.tsx:56`)
    — botão muda para "Fazer Login para Pagar";
  - `CheckIn` (`pages/CheckIn.tsx:66`) — tela inteira bloqueada com "Entre para ver suas reservas";
  - `ReviewExperiencePage` (`pages/ReviewExperiencePage.tsx:35`) — "Entre para avaliar sua experiência".

### 3.A.3 Autenticação e onboarding do consumidor

Dois pontos de entrada com **conjuntos de campos distintos**:

| | `LoginModal` (global) | `/auth` (`pages/Auth.tsx`) |
|---|---|---|
| Origem | montado em `App.tsx:9`, aberto por `openLoginModal()` | rota dedicada |
| Abas | Entrar / Criar Conta | Entrar / Cadastrar |
| Login social | Google (loga direto, `LoginModal.tsx:43`) | Google, Facebook, Apple (todos chamam `handleAuth`, `Auth.tsx:22`) |
| Campos de cadastro | Nome, E-mail, WhatsApp, Senha | Nome, E-mail, Senha, WhatsApp, **CPF**, **Data de nascimento** |
| Bônus | +50 Loops (`LoginModal.tsx:26-40`) | +50 Loops (`Auth.tsx:25-38`) |
| Pós-ação | fecha modal, permanece na página | `navigate('/')` |
| Termos | rodapé "Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade" | — |

`ℹ️ SIMULADO`: não há validação de formato, verificação de e-mail, OTP, senha forte ou
antifraude; qualquer submit autentica.

### 3.A.4 Descoberta de parceiros e experiências

**Catálogo de Experiências** (`/experiencias` — `pages/ExperiencesPage.tsx:10`)

- Hero do catálogo com saldo de Loops quando logado (`:66-71`).
- **Filtros combináveis** (`:28-38`):
  1. busca textual (título, subtítulo, parceiro, bairro);
  2. **tipo de experiência**: Todos, Gastronomia, Sunset & Drinks, Tour & Roteiro, Harmonização,
     Show & Evento, Workshop & Aula (`:18-26`);
  3. **bairro** (select alimentado por `mockNeighborhoods`).
- Botão "Limpar filtros" quando há filtro ativo; estado vazio com CTA de reset.
- Banner hero + banner intersticial.
- Módulo **"O que fazer no bairro"** (`components/discovery/NeighborhoodExplorer.tsx:13`):
  pills de 7 bairros; para o bairro ativo mostra tagline, descrição, vibe, destaques,
  contagem de parceiros/experiências e as listas locais (match por nome de bairro com regras
  auxiliares por `id`, `:28-49`).
- Card de experiência (`components/experiences/ExperienceCard.tsx:9`): tipo, badge, nota + nº de
  avaliações, parceiro, bairro, duração, 2 primeiros itens inclusos ("+N outros itens inclusos"),
  preço por pessoa, `+X% Cashback` e CTA **"Comprar Experiência"**.

**Ficha do restaurante** (`/restaurante/:id` — `pages/RestaurantDetails.tsx:9`)

Resolução do parceiro: primeiro no store `restaurants`, senão converte a partir de
`mockGuestRestaurants` (`:16-39`); se não achar, tela "Parceiro não encontrado".
Conteúdo: hero com categoria/nota, **card de benefício Loopis** (`promotion`), **galeria** com
lightbox (setas, miniaturas, contador), **cardápio** com pratos escolhidos por categoria
(Frutos do Mar / Italiano / fallback), localização com botão "Abrir Rota no GPS"
(`maps.google.com/?q=...`, `:336`), horário de funcionamento, avaliações do Google (mock fixo) e
`ApprovedReviewsSection` (avaliações internas aprovadas). CTA fixo inferior:
"Fazer Reserva e Ganhar Loops" / "Cadastre-se para Reservar".

**Perfil do parceiro** (`/parceiro/:id` — `pages/PartnerProfilePage.tsx:8`)

Capa, selo "Parceiro verificado", 3 métricas (Avaliação, Loops de volta, Produtos ativos),
lista de experiências do parceiro (link para `/experience/{id}`) e avaliações aprovadas.

### 3.A.5 Fluxos de conversão **por tipo de parceiro**

A página `/experience/:id` (`pages/ExperienceDetailView.tsx:195`) é o núcleo da conversão
diferenciada por vertical.

**Classificação da vertical** (`:17-22`):

```
macroCategory === 'Eventos/Shows'   ou type === 'Show & Evento'   → EVENT
macroCategory === 'Tours/Roteiros'  ou type === 'Tour & Roteiro'  → TOUR
type === 'Aventura & Mar'                                          → RENTAL
caso contrário                                                     → RESTAURANT
```

**Enriquecimento por vertical** (`toExperienceDetail:81-158`) — define `primaryAction` e o bloco
de regras específico:

| Vertical | `primaryAction` | Bloco de dados |
|---|---|---|
| Restaurante | `RESERVATION` | `reservation`: `minGuests 1`, `maxGuests = maxParticipants ?? 8`, `availableTimes ['19:00','19:30','20:00','20:30','21:00']` |
| Tour | `SLOT_BOOKING` | `slotBooking`: `durationMinutes 240`, `departureTimes ['09:00','14:00']`, `maxCapacityPerSlot`, `meetingPointLabel` |
| Locação | `SLOT_BOOKING` | `slotBooking`: `minimumRentalHours 1`, `availableUnits 4`, `requiresSecurityDeposit true` |
| Evento | `TICKET_PURCHASE` | `ticketPurchase`: `startsAt`, `gateOpensAt '19:00'`, `ageRating '16'`, `ticketLots` (2º Lote / Setor VIP com estoque) |

**Jornada de compra exibida ao usuário** (`getJourney:159-193`) — 4 passos por vertical:

| Vertical | Passo 1 | Passo 2 | Passo 3 | Passo 4 |
|---|---|---|---|---|
| Restaurante | Agende sua mesa | Faça o check-in | Lance a comanda | Pague do seu jeito |
| Evento | Escolha lote e setor | Informe titulares | Use Loops no checkout | Entre pelo validador |
| Locação | Escolha ativo e horário | Defina duração | Revise participantes | Retire ou use no local |
| Tour | Escolha a saída | Informe passageiros | Revise inclusos | Pague com Loops |

**Ação primária por vertical** (`openPrimaryAction:224-228` e `ExperienceStickyActionBar`):

| Vertical | Rótulo do botão | Componente aberto |
|---|---|---|
| Restaurante | "Reservar Mesa" | `ReserveTableModal` |
| Tour | "Escolher Data e Horário" | `BookTourModal` |
| Locação | "Ver Horários Livres" | `BookTourModal` (modo `isRental`) |
| Evento | "Comprar Ingressos" | `SelectTicketsSheet` |

Na barra fixa mobile, o **restaurante** ganha uma ação secundária exclusiva:
**"Escanear Conta / Split"** → `/checkout/split?tab=split` (`components/experience/ExperienceStickyActionBar.tsx:16-33`).

#### 3.A.5.1 Restaurante — reserva sem pagamento antecipado

`ReserveTableModal` (`components/experience/ReserveTableModal.tsx:9`):
seleção de dia (Hoje/Amanhã/Sábado/Domingo), horário entre os `availableTimes` e número de pessoas
com stepper limitado por `minGuests`/`maxGuests`. Mensagem-chave:

> "Os Loops poderão ser usados **depois do check-in**, quando a comanda for fechada e o pagamento for individual."

Mostra a trilha "Check-in no local · Comanda por QR/nota · Pix ou pagamento local" e o bônus
estimado (`priceFrom × cashbackPercent / 100`). O botão "Confirmar Reserva" apenas fecha o modal.

Fluxo alternativo completo de reserva: `BookingModal` (`components/BookingModal.tsx:13`), usado em
`/restaurante/:id` — 2 passos (seleção de data/hora/pessoas → confirmação), aplica o benefício da
casa, cria a reserva no store e **auto-confirma em 2 s** (`store/useStore.ts:812-817`), redirecionando
para `/reserva/checkin`.

#### 3.A.5.2 Tour — reserva de saída com manifesto

`BookTourModal` (`components/experience/BookTourModal.tsx:11`), modo tour:
grade de dias (12–19), horários de saída vindos de `departureTimes`, stepper de **vagas**,
nome do responsável e **documento/telefone dos passageiros**; toggle de uso de Loops;
"Pagar com Pix ou Cartão no app" → gera voucher **`LOOP-TOUR-#####`** com QR, dia/horário,
nº de passageiros, valor pago e Loops usados (`:35-40`, `:73-77`).

#### 3.A.5.3 Locação — reserva de ativo por hora

Mesmo componente em modo `isRental` (`BookTourModal.tsx:21`), com diferenças:
horários fixos `08:00/10:00/14:00/18:00`; stepper de **unidades** (em vez de vagas);
campo **"Duração da locação"** (1, 2 ou 3 horas); campo "Participantes autorizados";
voucher **`LOOP-LOC-#####`**. O tipo prevê `requiresSecurityDeposit` (caução) — exibido na
landing do detalhe e nas regras do parceiro.

#### 3.A.5.4 Evento — compra de ingressos por lote

`SelectTicketsSheet` (`components/experience/SelectTicketsSheet.tsx:9`):
lista de lotes com preço e disponibilidade; stepper por lote limitado por `availableQuantity`
(`:159`); total = Σ(preço × quantidade) (`:22-25`); toggle de Loops; pagamento gera voucher
**`LOOP-EVT-#####`** com resumo dos ingressos, total pago, titular e horário de abertura da portaria.
Botão desabilitado enquanto `total <= 0`.

#### 3.A.5.5 Fluxo paralelo de compra (catálogo)

`ExperienceBookingModal` (`components/experiences/ExperienceBookingModal.tsx:22`) — acionado pelos
cards do catálogo. Passo 1: data (5 opções), horário (5 opções), participantes (1–6, 8),
**forma de pagamento (Pix com aprovação imediata / Cartão até 12x)**, toggle de Loops com input
numérico e resumo financeiro. Passo 2: voucher `VOUCHER-XXXXXX` com QR, título, data/hora,
participantes e endereço, com CTA "Ver Meus Vouchers & Ingressos" → `/reserva/checkin`.
Ao pagar: `completeClientPayment(...)` + `createReservation(...)` (`:55-93`).

### 3.A.6 Cross-sell — montagem de pacote (`Loopis-Client/src/components/experience/LinkedCrossSellingSection.tsx`)

**Ponto de ativação**: exclusivamente na página `/experience/:id`, quando a experiência possui
`linkedRestaurants` e/ou `linkedRentals` no catálogo (`ExperienceDetailView.tsx:322-337`).
O componente não renderiza nada se ambas as listas estiverem vazias (`LinkedCrossSellingSection.tsx:38`).

**Bloco explicativo fixo** (`:40-60`): "Monte seu Pacote com Restaurante e Locações" + badge
**"Múltiplos Vouchers"** + texto: *"Ao concluir o pagamento único, serão gerados vouchers individuais
e com QR Code para cada item reservado (um para o evento/tour, um para o restaurante e um para a locação)."*

**Seção 1 — Restaurantes disponíveis no roteiro** (`:63-223`)

| Regra | Comportamento |
|---|---|
| Cardinalidade | **Seleção única**. Clicar em outro restaurante substitui; clicar no selecionado remove (`:96-103`) |
| Remoção | Link "Remover refeição" no cabeçalho quando há seleção (`:75-83`) |
| Dados exibidos | foto, categoria, nome, localização, **benefício especial** (`specialBenefit`), descrição, preço/pessoa e `+X% Cashback` |
| Agendamento `fixed` | exibe `fixedDateTime` (ex.: "Sábado • 13:00 às 15:00") — cliente não escolhe (`:162-168`) |
| Agendamento `client_choice` | exibe "Livre para escolher"; ao selecionar, abre grade de `availableTimes` (`:176-200`) |
| Pré-seleção | ao marcar, assume o **primeiro horário** disponível (`ExperienceDetailView.tsx:230-238`) |

**Seção 2 — Locações & equipamentos** (`:225-352`)

| Regra | Comportamento |
|---|---|
| Cardinalidade | **Seleção múltipla** (toggle por item) (`:247`, `ExperienceDetailView.tsx:243-257`) |
| Dados exibidos | foto, parceiro da locação, título, descrição, preço + `unitLabel` (por hora/diária/kit/pessoa) e `+X% Cashback` |
| Agendamento `fixed` | exibe `fixedDateTime` (ex.: "Entregue a bordo no início do passeio") |
| Agendamento `client_choice` | grade de `availableSlots` (ex.: "11:00 às 12:00") |
| Pré-seleção | primeiro slot disponível ao marcar |

**Painel de resumo do pacote** (coluna direita, `ExperienceDetailView.tsx:399-447`):

```
totalPacote  = experiencia.priceFrom + (restauranteSelecionado?.pricePerPerson ?? 0)
                                     + Σ(locacoesSelecionadas.price)          // :213-215
loopsPacote  = round(totalPacote × experiencia.cashbackPercent / 100)          // :216
vouchers     = 1 + (restauranteSelecionado ? 1 : 0) + qtdLocacoes              // :217
```

Exibe: total do pacote, "+ Ganhe N Loops de Cashback", detalhamento linha a linha
(🎟️ experiência, 🍽️ restaurante, 🏄 cada locação) e o card **"Vouchers a Gerar: N Vouchers"**
com a copy "Gera N vouchers individuais (um para cada atividade e restaurante)".
No hero, quando `vouchers > 1`, aparece o selo **"N Vouchers no Combo"** (`:281-285`).

**⏳ PENDENTE (validado com o Cliente: o combo é requisito)** — hoje a seleção de cross-sell
**não é repassada** aos modais de compra (`ReserveTableModal`, `BookTourModal` e `SelectTicketsSheet`
recebem apenas `experience`, `:460-469`). O pacote é montado, precificado e exibido, mas o
pagamento único e a emissão de N vouchers **ainda não são executados**. Requisito confirmado como
desejado; falta especificar: rateio do cashback por item (hoje aplica o % da experiência principal
sobre o total), multiplicação do valor por participante, e vínculo dos vouchers no histórico.

**Outros mecanismos de cross-sell/upsell no PWA:**

| Mecanismo | Local | Comportamento |
|---|---|---|
| Banner hero patrocinado | Home e Catálogo | carrossel 6 s → rota interna do parceiro/experiência |
| Banner intersticial | Home e Catálogo | patrocinador com CTA para `/experiencias` |
| Explorador de bairros | Catálogo | parceiros + experiências do bairro selecionado |
| Barra fixa do restaurante | Detalhe da experiência | "Escanear Conta / Split" |
| Chatbot Loopi | Global (logado) | sugestões contextuais + CTA de navegação |
| Amigos | Perfil / Header | rede para dividir conta |

### 3.A.7 Chatbot "Loopi" (`components/chat/LoopiChatbot.tsx` + `services/loopiKnowledge.ts`)

- Renderiza **apenas** para `isLoggedIn && currentRole === 'client'` (`LoopiChatbot.tsx:78-80`);
  balão de boas-vindas some após 12 s; resposta simulada em 450 ms.
- Motor determinístico por normalização de texto (remove acentos, lowercase) e `includes`
  (`loopiKnowledge.ts:378-390`). **Não há LLM nem API.**

| # | Intent | Gatilhos (exemplos) | Resposta / CTA |
|---|---|---|---|
| 1 | Restaurante específico | nome do parceiro + (comer, cardápio, menu, prato, pedir, preço, opções, especialidade) | cardápio completo com preços, especialidade e benefício → `/restaurante/{id}` |
| 2 | Frutos do mar | frutos do mar, peixe, camarão, ostra, bacalhau, polvo | 3 parceiros com % de cashback → Marisqueira Sintra |
| 3 | Italiano | italiano, massa, pizza, risoto, vinho | Trattoria Carbone |
| 4 | Hambúrguer | hamburguer, burger, lanche, batata frita, smash | Soul Burger |
| 5 | Bar / happy hour | bar, chopp, cerveja, petisco, happy hour, boteco | Boteco ORI |
| 6 | Japonês | japones, sushi, sashimi, oriental, omakase | Nikkei Fusion & Sushi Prime |
| 7 | Bairro | santo antonio, por do sol, sunset, centro, beira mar, lagoa, barra da lagoa | destaques do bairro |
| 8 | Saldo | saldo, meus loops, quantos loops, pontos, carteira | saldo atual + como usar → `/carteira` |
| 9 | Cupom fiscal | escanear, cupom fiscal, nota fiscal, nfce, scanner, qr code, comanda | passo a passo → `/scanner` |
| 10 | Experiências | experiencia, passeio, lancha, degustacao, roteiro, tour | 4 experiências com preço e cashback → `/experiencias` |
| 11 | Como funciona | como funciona, o que e o loopis, vantagens, desconto, cashback | pitch em 4 passos |
| 12 | Saudação / fallback | oi, ola, bom dia, ajuda… | apresentação + sugestões |

### 3.A.8 Comanda, cupom fiscal e pagamento

**Entradas do fluxo:**

| # | Rota/Componente | Mecânica |
|---|---|---|
| 1 | `/scanner` (`pages/ScannerPage.tsx:7`) | `CameraViewfinder` **simulado** (sem `getUserMedia`; lanterna e troca de câmera são decorativas) ou `ManualCodeModal` → `mockApi.fetchOrderReceipt` |
| 2 | `/carteira/ler-cupom` (`pages/ScanReceipt.tsx:23`) | 3 passos: upload/foto → animação "OCR SEFAZ" (2,2 s) → extrato lido (itens, subtotal R$ 261,20, desconto R$ 20,00, total R$ 241,20, +241 Loops) |
| 3 | `ReceiptScannerModal` (`components/ReceiptScannerModal.tsx:42`) | aberto em `/reserva/checkin` para reserva de restaurante em andamento; abas QR / manual; exige login |

**Leitura da comanda** — `mockApi.fetchOrderReceipt` (`services/mockApi.ts:288`):

| Entrada | Resultado |
|---|---|
| `CMD-PAGA` / `PAGA` | erro `ORDER_ALREADY_PAID` — "Esta comanda já foi totalmente liquidada e encerrada." |
| `CMD-CANCELADA` / `CANCELADA` | erro `ORDER_CANCELLED` — "Esta comanda foi cancelada pelo restaurante." |
| `CUPOM-EXP` / `EXPIRADO` | erro `COUPON_EXPIRED` — "O cupom/código informado já expirou." |
| `LOOP-8821`, `CMD-4091`, `TIM-1092` | comanda completa do catálogo mock |
| Regex `^(LOOP\|CMD)-\d{4}$` | comanda gerada dinamicamente (Marisqueira Sintra, mesa aleatória, 15% de benefício) |
| Qualquer outro | erro `NOT_FOUND` — "Cupom ou comanda não localizada." |

**Resumo da comanda** (`/order-summary` — `pages/OrderSummaryPage.tsx:15` + `hooks/useOrderSummary.ts`):

- Cabeçalho com restaurante, logo, mesa, atendente, código e horário; status "Aberta".
- `OrderItemList`: itens com quantidade, preço unitário, total e observações.
- `FinancialBreakdown`: subtotal → desconto base (reserva/campanha) → cupom extra →
  taxa de serviço (10%) → **Total Líquido a Pagar** + "Economia total de R$ X" + Loops a ganhar.
- Campo de **cupom extra** com validação assíncrona (`mockApi.validateCoupon`).
- CTA "Ir para o checkout" → `/checkout/split?orderCode=...&netTotal=...&subtotal=...&discount=...&tab=full`
  (`useOrderSummary.ts:109-113`).

**Checkout** (`/checkout/split` — `pages/CheckoutSplitPage.tsx:27` + `hooks/useSplitPayment.ts`):

*Aba "Pagar Tudo (Integral)"*
1. Destaque do valor após abatimento de Loops e cashback previsto.
2. **Uso de Loops**: toggle "Você tem N Loops. Você deseja utilizar Loops para pagar?" com input
   numérico, máximo permitido e texto "1 Loop = R$ 1 de abatimento. Disponível apenas no pagamento individual."
3. **Métodos**: Pix Instantâneo (QR real renderizado por `qrcode.react` + "Copiar Chave Pix"),
   Cartão de Crédito ("até 3x sem juros"), Carteira Digital (Apple/Google Pay).
4. "Confirmar Pagamento Integral (R$ X)" → `handlePayFullDirect(loopsToUse)` → confete + modal
   "Conta 100% Liquidada!".

*Aba "Dividir Conta (Split)"*
1. `SplitProgressBar`: total, pago, restante, % e participantes pagos/total.
2. **Modo de divisão**: "Partes Iguais" (chips 2, 3, 4, 5, 6, 8 mostrando o valor por pessoa) ou
   "Customizado" (valor editável por participante).
3. "Adicionar Convidado" cria participante extra; em modo igual, recalcula a divisão.
4. Cada `SplitParticipantCard` traz: avatar/inicial, nome, tipo (Você/organizador, usuário Loopis,
   convidado), valor e % da conta, **badge de Loops da fração**, e para convidados:
   **QR Code Pix da fração**, "Copiar Link", **"WhatsApp"** e "Simular Pagamento".
5. Convidado pode ser **vinculado a um usuário Loopis** via `UserSearchModal`
   (busca por nome, @username, telefone ou e-mail; permite também enviar convite de amizade).
6. Ao completar 100%: confete + modal de conclusão com o cashback concedido.

### 3.A.9 Carteira, cupons e regulamento

| Tela | Conteúdo |
|---|---|
| `/carteira` (`pages/Wallet.tsx:6`) | cartão com saldo em Loops; atalho "Ler Cupom Fiscal"; card de regra "A cada R$ 1,00 consumido você ganha 1 Loop"; **extrato** com ícone e cor por tipo (`earn` verde, `redeem` vermelho, `bonus` violeta) |
| `/cupons` (`pages/Coupons.tsx:5`) | cupons ativos (título, restaurante, validade, código) e utilizados/expirados — lista hardcoded |
| `/regulamento` (`pages/Rules.tsx:6`) | "Como ganhar Loops?": Cadastro Completo +50, Fazer Reserva +10, Check-in e Consumo 1 Loop por R$ 1, Indicar Amigos +100; CTA "Falar com Suporte" |
| `/descontos*` | redirecionam para `/carteira` (`routes.tsx:43-44`) |

`redeemReward(rewardId)` existe no store (`store/useStore.ts:833`) e valida saldo suficiente,
mas **não há tela de resgate** ativa.

### 3.A.10 Minhas Reservas & Compras (`/reserva/checkin` — `pages/CheckIn.tsx:41`)

Agenda unificada das 4 verticais, com metadados visuais por vertical
(Restaurante/rosa, Tour & Aventura/ciano, Evento & Festa/fúcsia, Locação/âmbar — `:23-28`).

- **Contadores**: Próximas (`confirmed`), Agora (`checked_in`), Concluídas (`completed`).
- **Faixa de destaque** quando há experiência em andamento, com CTA "Abrir comanda".
- **Filtros**: Próximas / Em andamento / Histórico / Todas.
- **Card**: imagem, vertical, status, produto, parceiro, data/hora, bairro, quantidade + rótulo
  (pessoas/passageiros/ingressos/horas), status de pagamento
  (`Pago no app` / `Pagamento no local` / `Aguardando pagamento`) e valor.
- **Ação primária adaptativa** (`handlePrimaryAction:76-88` / `actionLabel:90-94`):

| Vertical / Status | Rótulo | Efeito |
|---|---|---|
| Restaurante · `confirmed` | "Fazer check-in" | `updateClientBookingStatus(id, 'checked_in')` |
| Restaurante · `checked_in` | "Abrir comanda" | abre `ReceiptScannerModal` |
| Tour/Evento/Locação | "Ver voucher" | modal com QR e código |
| Qualquer · `completed` com review pendente | "Avaliar experiência" | `/avaliar/{notificationId}` |
| Qualquer · `completed` sem review | "Ver histórico" | `/notificacoes` |

- **Modal de detalhes**: voucher com QR e código, data/horário, participantes,
  **Loops usados** e **Loops recebidos**, total.

### 3.A.11 Notificações e avaliações internas

| Etapa | Implementação |
|---|---|
| Gatilho | `AppNotification` com `type: 'review_request'` (`store/useStore.ts:391`) |
| Listagem | `/notificacoes` (`pages/NotificationsPage.tsx:6`) com badge de não lidas, "Marcar lidas" e status "Avaliação enviada para moderação" / "Toque para avaliar" |
| Formulário | `/avaliar/:notificationId` (`pages/ReviewExperiencePage.tsx:8`): nota 1–5 (rótulos "Muito ruim"…"Excelente") e comentário |
| Validações | nota obrigatória; comentário ≥ 10 caracteres; 1 avaliação por notificação (`store/useStore.ts:897-899`) |
| Resultado | `InternalReview` com `status: 'pending'` + tela "Avaliação enviada — aguardando moderação" |
| Publicação | `ApprovedReviewsSection` exibe apenas `status === 'approved'` na ficha do parceiro |

### 3.A.12 Perfil e rede de amigos

`/perfil` (`pages/Profile.tsx:7`): dados editáveis (nome, e-mail, telefone, CPF, cidade) com selo
"Perfil Completo"; bloco **Amigos & Divisão de Conta** com badge de convites pendentes;
histórico de parceiros acessados; "Sair da Conta".

`FriendsModal` (`components/profile/FriendsModal.tsx:25`) — 3 abas:

| Aba | Funções |
|---|---|
| Amigos | lista com avatar, @username, saldo de Loops, "Conectado em…"; remover amigo |
| Convites | recebidos (aceitar/recusar) e enviados (pendentes) |
| Buscar | busca em `mockApi.searchUsers` (nome, @username, telefone, e-mail) + "Convidar por WhatsApp" |

Regras (`store/useStore.ts:722-782`): bloqueia convite para quem já é amigo ou tem convite pendente;
aceitar move o convite para a lista de amigos; recusar remove.

---

## 3.B — Loopis (Painel) · Módulo do Parceiro (adaptativo)

Layout: `PartnerLayout` (`Loopis/src/components/dashboard/PartnerLayout.tsx:39`) — sidebar colapsável
com o menu resolvido por `getPartnerNavigation(partnerType)`, cabeçalho "Painel do parceiro" com o
nome do parceiro, botão "Sair" e bottom nav mobile com os 5 primeiros itens.

### 3.B.1 Visão Geral (`/admin/dashboard` — `pages/partner/PartnerOverview.tsx:46`)

**Rótulos e metas mudam por vertical** (`verticalCopy:16-44`):

| Vertical | Métrica de venda | Título da agenda | Receita | Ticket médio |
|---|---|---|---|---|
| Restaurante | Reservas confirmadas | Próximas reservas | R$ 48.920 | R$ 156 |
| Tour | Vagas vendidas | Próximas saídas | R$ 63.400 | R$ 220 |
| Evento | Ingressos emitidos | Próximos eventos | R$ 82.100 | R$ 94 |
| Locação | Slots reservados | Próximas locações | R$ 27.760 | R$ 118 |

Componentes: 4 cards de KPI (GMV via Loopis, vendas da vertical, **Loops gerados** com equivalência
em R$, ticket médio), gráfico de movimento semanal (Seg–Dom), agenda das próximas 4 reservas e
contadores reais de Confirmadas / Check-ins / Concluídas vindos de `b2bReservations`.

### 3.B.2 Restaurante — Gestão de Mesas, Reservas e Comandas
`/admin/dashboard/mesas-reservas` (`pages/partner/RestaurantKanbanView.tsx`, 807 linhas)

**Kanban de 4 colunas** (`:6-11`):
`Solicitações (pending)` → `Confirmadas (confirmed)` → `Check-in feito (checked_in)` → `Conta/Pagamento (completed)`.
Rótulos de status: "Aguardando confirmação", "Reserva confirmada", "Cliente no salão",
"Conta encerrada", "No-show", "Cancelada" (`:13-20`).

**Filtro de período** (`:22`, `:105-125`): Hoje · Amanhã · Próximos 7 dias · Todos ·
Período personalizado (data inicial/final) + botão "Limpar".

**Lançamento de comanda** (`:158-244`) — dois modos:

| Modo | Fluxo | Dados gerados |
|---|---|---|
| **QR / NFC-e** | leitura simulada (1,2 s) | código `NFC-{id}`, subtotal R$ 286,90, 3 itens |
| **Foto da nota** | upload real (`FileReader` → base64) + leitura simulada (1,4 s) | código `NOTA-{id}`, subtotal R$ 342,50, 3 itens, `fotoCupomUrl` |

Em ambos: **taxa de serviço = 10%** do subtotal (`:59`, `:160`), `descontoLoops: 0`,
`status: 'aguardando_pagamento'`, `origemEmissao: 'restaurante'` e `qrCodeData` apontando para o
checkout do PWA.

**Geração de cobrança** (`:251-273`):

| Regra | Implementação |
|---|---|
| Modo | "Conta completa" ou split em N partes (N pré-carregado com o nº de pessoas da reserva, limitado a 2–10) |
| Divisão | `splitAmountInCents` distribui centavos restantes entre as primeiras partes (`:87-93`) |
| Atribuição | cada parte pode ser vinculada a um usuário Loopis (titular da reserva + 4 usuários mock) |
| Cobrança | payload Pix por parte (`:95-96`) + link `app.loopis.com.br/pagar/{comanda}/{ref}` |
| Loops | `loopsToEarn = floor(valor)` **apenas se a parte tiver usuário vinculado** (`:268`) |

**Encerramento**: "Marcar como pago" → `processBilling(reservaId, total)` → reserva vai para
`completed` e credita `floor(total)` Loops (`:275-279`, `store/useStore.ts:612-631`).

### 3.B.3 Tour

| Tela | Rota | Funcionalidades |
|---|---|---|
| **Meus Tours & Aventuras** | `/agenda-saidas` (`TourScheduleView.tsx`) | CRUD de tours: nome, descrição, ponto de encontro, horários de saída, máx. de pessoas, preço, status `ativo/pausado`, **capa por upload** e **vínculo com recursos** (guias, embarcações, equipamentos) |
| **Manifesto de Passageiros** | `/manifesto` (`TourPassengerManifestView.tsx`) | seleção da saída; métricas (embarcação, guia responsável, ocupação `ocupados/capacidade`, lugares presentes); busca por nome/telefone/documento; status `confirmado \| presente \| pendente \| cancelado`; **contato de emergência**; "Exportar lista" |
| **Guias e Embarcações** | `/guias-equipamentos` (`TourGuidesFleetView.tsx`) | CRUD de recursos por tipo `guia \| embarcacao \| equipamento`, com capacidade, documento (CADASTUR, inscrição naval, lote), status `ativo \| manutencao \| indisponivel`, foto e filtro por tipo |
| **Validador de Embarque** | `/portaria` | `EventGateValidatorView` com textos adaptados ao tour (código `LOOP-TOUR-####`) |

### 3.B.4 Evento

| Tela | Rota | Funcionalidades |
|---|---|---|
| **Meus Eventos & Festas** | `/lotes-ingressos` (`EventTicketTierView.tsx`) | CRUD de evento: nome, descrição, data, **setor**, **lote**, preço, quantidade, vendidos, capa, **itens inclusos** (lista dinâmica) e **política de cancelamento** por evento |
| **Validador de Portaria** | `/portaria` (`EventGateValidatorView.tsx:33`) | leitura por QR simulado ou **código manual**; busca por titular/código/documento; contadores de validados, válidos e bloqueados |
| **Promoters & Comissões** | `/promoters` (`EventPromotersCommissionView.tsx`) | CRUD de promoter (nome, descrição, telefone, Instagram, **cupom próprio**, **% de desconto**, **% de comissão**, status) + painel de vendas por promoter (ingressos, GMV bruto, comissão) |

**Regras do validador** (`EventGateValidatorView.tsx:47-83`):

| Situação do ingresso | Resultado |
|---|---|
| Código não encontrado | ❌ "Ingresso não encontrado — Confira o QR Code ou o código digitado" |
| `cancelado` | ❌ "Ingresso cancelado — {titular} não possui entrada liberada" |
| `validado` (2ª leitura) | ⚠️ "Entrada já validada às {hora}" **e o ingresso passa a `duplicado`** |
| `valido` | ✅ "Entrada liberada — {titular} • {setor} • {lote}", grava horário e marca `validado` |

O mesmo componente serve **Tour** ("Validador de Embarque") e **Locação** ("Validador de Retirada"),
trocando títulos, descrição e prefixo do código (`:87-115`).

**Regras de promoter** (`EventPromotersCommissionView.tsx:49-113`):
cupom gerado automaticamente a partir do nome (7 caracteres alfanuméricos + 2 dígitos) quando não
informado; `couponDiscountPercent` e `commissionPercent` limitados a 0–100%;
`comissão = GMV bruto × commissionPercent / 100`.

### 3.B.5 Locação

| Tela | Rota | Funcionalidades |
|---|---|---|
| **Locações & Quadras** | `/grade-horaria` (`RentalAssetsView.tsx`) | CRUD de ativos: nome, descrição, tipo (Quadra, Jet-ski…), **preço/hora**, **mínimo de horas**, grade de horários, status `disponivel \| manutencao \| bloqueado`, foto |
| **Manutenção / Clima** | `/bloqueios` (`RentalMaintenanceView.tsx`) | bloqueios operacionais por ativo com motivo `manutencao \| clima \| evento_privado \| outro`, data, hora início/fim, status `agendado \| ativo \| resolvido`, observação e filtro por data |
| **Validador de Retirada** | `/portaria` | `EventGateValidatorView` adaptado (código `LOOP-LOC-####`) |

### 3.B.6 Telas comuns a todas as verticais

**Clientes** (`/clientes` — `pages/partner/PartnerClientsView.tsx`)
Histórico por cliente: nome, telefone, última participação, jornada, status
(`confirmado | compareceu | pago | pendente`), total gasto, Loops gerados e nº de visitas.
Para restaurante, agrupa `b2bReservations` por telefone e reconstrói o histórico de comandas
(itens, taxa de serviço 10%, desconto em Loops, forma de pagamento); demais verticais usam
conjuntos sintéticos coerentes com a operação. Busca por texto e filtro por status; drill-down
na comanda.

**Configurações da Conta** (`/configuracoes` — `pages/partner/PartnerAccountSettings.tsx:18`)

| Bloco | Campos |
|---|---|
| Dados comerciais | nome fantasia, telefone/WhatsApp, endereço, **descrição do parceiro** |
| Mídia | **logo** e **galeria** com upload (base64) |
| Operação | horários por dia da semana (7 linhas), **taxa de serviço** (default 10% só para restaurante), **capacidade padrão** (evento 450 · tour 12 · locação 4 · restaurante 18) |
| Regras | política de cancelamento e **regra comercial** pré-preenchida por vertical (evento: "Ingressos nominais com validação na portaria"; tour: "Termo de responsabilidade obrigatório"; locação: "Caução obrigatória para equipamentos motorizados"; restaurante: "Reserva garantida por tolerância de 15 minutos") |
| Financeiro | **chave Pix de repasse** |
| Cardápio | **apenas restaurante**: CRUD de itens (nome, descrição, preço, imagem) |

`ℹ️ SIMULADO`: "Salvar" apenas exibe confirmação por 2,2 s; só os itens de cardápio vão ao store.

**Avaliações** (`/avaliacoes` — `pages/partner/PartnerReviewsModerationView.tsx`)
Fila filtrada pelo `partnerType` do parceiro logado; busca por cliente/experiência/comentário;
filtro por status; contadores Pendentes / Publicadas / Ocultas; ações **Publicar**, **Ocultar**,
**Rejeitar** (`approved | hidden | rejected`).

---

## 3.C — Loopis (Painel) · Módulo Restaurante legado (`/restaurante/*`)

Painel anterior ao modelo adaptativo, ainda ativo e acessado pelo **fluxo de cadastro** do login
(`Loopis/src/pages/Login.tsx:65-71`). Layout próprio (`layouts/RestaurantLayout.tsx:6`) com menu:
Dashboard · Reservas · Atividades & Histórico · Lançar Comanda · Campanhas · Configurações
(+ rotas fora do menu: `/onboarding`, `/ler-cupom`, `/comercial`).

### 3.C.1 Onboarding do parceiro (`/restaurante/onboarding` — `pages/restaurant/Onboarding.tsx`)

Banner comercial permanente: **"Sem taxa de setup para os 100 primeiros parceiros!"** e botão
"Copiar Link de Autocadastro" (`:130`, `:179`).

**Wizard de 3 passos** (`:116-119`):

1. **Tipo de parceiro** (`partnerTypesConfig:81-113`):

| Opção | Descrição | Badge |
|---|---|---|
| Restaurante / Gastronomia | restaurantes, bares, bistrôs, cafeterias com cardápio e fotos | Cardápio & Fotos |
| Tour & Roteiro | passeios náuticos, rotas cervejeiras, tours históricos e gastronômicos | Itinerário & Guia |
| Evento & Festival | festivais gastronômicos, feiras de vinhos, encontros temáticos | Ingressos & Lotes |
| Locação | quadras, jet-skis, equipamentos e estruturas reserváveis por horário | Agenda & Caução |

2. **Dados gerais + campos específicos**: nome, categoria, endereço, telefone, horário;
   restaurante → CRUD de cardápio com upload de imagem; experiência → inclusos, duração,
   preço por pessoa, capacidade; tour → ponto de encontro, roteiro, duração, preço;
   evento → data, horário, local, preço do ingresso, atrações; show → artista, data, horário, couvert.
3. **Conclusão** → `/restaurante/dashboard`, persistindo os itens de cardápio no store (`:121-127`).

**Wizard alternativo não roteado**: `components/onboarding/PartnerWizard.tsx` implementa um
onboarding de **5 passos** (Categoria · Dados gerais · Configuração · Comercial · Conclusão) com
validação `zod` discriminada por vertical, rascunho automático em `localStorage`
(`loopis-partner-wizard-draft`) e campos comerciais (chave Pix, % de comissão, regra de repasse
default "Repasse D+14 sobre vendas confirmadas pela Loopis"). Ver anexo de inconsistências.

### 3.C.2 Emissor de Comanda & Cobrança (`/restaurante/lancamento` — `pages/restaurant/ManualEntry.tsx`)

Módulo de caixa/garçom, com 3 abas de composição da conta:

| Aba | Fluxo |
|---|---|
| **Cardápio** | seleção de itens do cardápio com stepper de quantidade |
| **Avulso** | valor livre + descrição |
| **Nota** | upload da foto do cupom → OCR simulado (1,5 s) → preenche R$ 272,00 e "Cupom Fiscal #09281 - Leitura IA Automática" |

Cálculo (`:54-56`): `taxaServico = subtotal × 10%`; `total = subtotal + taxaServico`;
`loopsEstimados = floor(total)` (exibido como "Cliente receberá aprox. N Loops de Cashback").

Emissão (`:93-122`): gera `ComandaRecord` com código `COM-####`, dados do cliente, mesa, itens,
`status: 'aguardando_pagamento'` e **QR Code real** apontando para
`https://loopis.com.br/checkout/split?comanda={code}&total={total}`.

Confirmação de pagamento (`:125-152`): métodos `pix | cartao | split`; ao confirmar, cria um
`PartnerActivityRecord` com `statusPresenca: 'compareceu'`, `totalGasto` e
`loopsGerados = floor(total)`.

### 3.C.3 Demais telas do módulo legado

| Tela | Rota | Conteúdo |
|---|---|---|
| **Dashboard** | `/dashboard` | 4 atalhos (Lançar Comanda, Atividades & Histórico, Ler Cupom Fiscal, Gerir Ofertas), KPIs de reservas/check-ins e gráfico semanal (`recharts`) |
| **Reservas** | `/reservas` | kanban simplificado (Novas Solicitações → Aceitas → No Salão → Concluídas) com aceite, check-in e "Lançar Consumo" (`BillingModal`) |
| **Atividades & Histórico** | `/atividades` | filtros de data (hoje/ontem/semana/personalizada/todas), presença (compareceu/no-show), tipo de parceiro e busca por nome/telefone/código/mesa; métricas do período (clientes, comparecimentos, no-shows, faturamento, Loops) e modal com a comanda detalhada |
| **Campanhas** | `/campanhas` | criação de campanha: título, tipo (`porcentagem \| valor_fixo \| cashback_dobro`), valor, **dias da semana**, janela de horário e imagem → `regraHorario` textual ("Válido Terça, Quarta das 18:00 às 22:00") |
| **Configurações e Mídia** | `/configuracoes` | fotos, vídeo, redes sociais, Google Maps e CRUD do cardápio |
| **Leitura de Cupom Fiscal (IA)** | `/ler-cupom` | módulo rápido para o caixa; leitura simulada (3,5 s) devolvendo R$ 185,50; copy menciona extração do **CPF do cliente** |
| **Configurações Comerciais** | `/comercial` | mesma tela descrita em §3.D.9 |

---

## 3.D — Loopis (Painel) · Módulo Admin Loopis (`/admin/*`)

Layout `AdminLayout` (`layouts/AdminLayout.tsx:6`) com **dark mode forçado**, sidebar colapsável,
identificação "Maurício · Super Admin" e bottom nav mobile.

### 3.D.1 Dashboard da rede (`/admin/dashboard-admin`)
KPIs: **Parceiros Ativos 186**, **GMV da Rede R$ 485K**, **Pedidos e Reservas 12.450**;
mix por vertical (Restaurantes 42% · Tours 23% · Eventos 19% · Locações 16%);
volume mensal (12 meses, realizado × meta) e série anual. `ℹ️ SIMULADO` — valores estáticos.

### 3.D.2 Fila de Aprovação de Parceiros (`/admin/aprovacoes` — `pages/admin/Approvals.tsx:16`)
Lista de `PartnerRequest` com `status === 'pending'`, ícone por vertical, busca por nome e
contador de solicitações. Drawer de detalhe com categoria, endereço, telefone, resumo e,
quando houver, cardápio e fotos enviados.

- **Aprovar** (`store/useStore.ts:667-698`): marca a solicitação como `approved` e **cria o parceiro**
  em `restaurants` com `status: 'aprovado'`, `tipoParceiro` da solicitação, rating 5.0,
  promoção "Novo Parceiro! Ganhe Loops", horário "A definir" e cardápio (o enviado ou o default).
- **Rejeitar**: marca como `rejected`.

### 3.D.3 Parceiros & Estabelecimentos (`/admin/restaurantes`)
Tabela com busca por nome e filtros por **tipo** (restaurante/tour/evento/rental) e **status**
(aprovado/pendente/bloqueado); colunas Parceiro, Tipo, Categoria, Status, Ações
(editar, bloquear, excluir). `ℹ️ SIMULADO` — ações sem efeito.

### 3.D.4 Base de Clientes (`/admin/clientes`)
Tabela de usuários com busca por nome/e-mail, filtro por `statusCadastro`
(completo/simplificado), saldo em Loops, contato e ações editar/bloquear. `ℹ️ SIMULADO`.

### 3.D.5 Gestão de Cobranças (`/admin/cobrancas` — `pages/admin/Billing.tsx`)
Fechamento mensal B2B por parceiro: **GMV Transacionado**, **Comissão Loopis**, status
`pending` (Pendente) / `generated` (Boleto Gerado) / `paid` (Pago), seletor de mês, detalhe da
fatura e impressão via `window.print()` (`:24`).

### 3.D.6 Tabela de Pontuação (`/admin/pontuacao` — `pages/admin/ScoreConfig.tsx:7-12`)

| Ação | Valor (Loops) | Descrição no código |
|---|---|---|
| Cadastro Completo | 50 | Bônus ao preencher todos os dados do perfil |
| Reserva Realizada | 10 | Pontos iniciais apenas por confirmar a reserva |
| Check-in Efetuado | 20 | Recompensa ao chegar no restaurante (além do cashback do consumo) |
| Indicação de Amigos (Referral) | 100 | — |

`⏳ PENDENTE` — os valores oficiais serão definidos com o Cliente; o store e o regulamento do PWA
trazem valores divergentes (ver anexo).

### 3.D.7 Auditoria IA de Cupons Fiscais (`/admin/auditoria`)
Fila de leituras da IA com ID, data, **valor lido (IA)**, origem (`cliente | restaurante`) e
status (`pendente | aprovado | reprovado | ajustado`); busca por ID e filtro por status;
visualização da imagem do cupom e ações **Aprovar / Reprovar / Ajustar valor**.
`ℹ️ SIMULADO` — `handleAction` não altera estado (`pages/admin/AuditReceipts.tsx:32`).

### 3.D.8 Configurações Globais (`/admin/configuracoes` — `pages/admin/Settings.tsx`)
"Parâmetros centrais do motor de regras Loopis":

| Parâmetro | Campo | Descrição no código |
|---|---|---|
| Comissão Base Loopis (%) | `loopisCommissionPercent` | Taxa cobrada do parceiro sobre o GMV via app |
| Cashback Padrão (%) | `defaultCashbackPercent` | "Fator de conversão base. 1% = 1 Loop a cada R$ 100" |
| Teto de Desconto Máximo (%) | `maxDiscountAllowed` | "Limita campanhas agressivas criadas por parceiros para evitar dumping" |
| Cidade Ativa | `activeCity` | Cidade de operação |
| Cidade ativa/inativa | `isCityActive` | Liga/desliga a praça |

Defaults (`Loopis/src/store/useStore.ts:509-515`): comissão 10%, cashback 1%, teto 30%,
cidade "Florianópolis - SC", ativa.

### 3.D.9 Configurações Comerciais do Restaurante
`/admin/restaurant/settings` · `/admin/restaurant-settings` · `/restaurante/comercial` ·
`Loopis-Client:/admin/restaurant/settings`
(`pages/admin/RestaurantBillingSettingsPage.tsx` + `hooks/useRestaurantBilling.ts`)

| Bloco | Campos |
|---|---|
| Mensalidade (SaaS) | toggle `hasMonthlyFee` + `monthlyFeeAmount` |
| Comissão | `commissionPercent` (% sobre GMV) |
| Créditos Loop | toggle `acceptsLoopCredits` + `loopConversionRate` |
| Faturamento | `invoiceDueDay` (1–31) |
| Dados bancários | banco, tipo de conta, agência, conta, **chave Pix** |
| Simulador | GMV mensal simulado → comissão, mensalidade, **repasse líquido** e Loops estimados |

**Validações** (`hooks/useRestaurantBilling.ts:66-91` e `services/mockApi.ts:504-523`):

| Campo | Regra | Mensagem |
|---|---|---|
| `monthlyFeeAmount` | obrigatório se `hasMonthlyFee`; ≥ 0 | "A mensalidade não pode ser negativa." |
| `commissionPercent` | obrigatório; 0 ≤ x ≤ 100 | "A comissão deve estar entre 0% e 100%." |
| `loopConversionRate` | > 0 se `acceptsLoopCredits` | "A taxa de conversão deve ser superior a 0." |
| `invoiceDueDay` | 1 ≤ x ≤ 31 | "Dia de vencimento deve ser entre 1 e 31." |

---

## 3.E — Loopis-landing-page (captação B2B)

SPA de página única sem router (`src/App.tsx:11`), com âncoras internas.
Título da aba: **"Loopis para Restaurantes | Cadastre seu Estabelecimento"** (`index.html:7`).

| Seção | Âncora | Conteúdo |
|---|---|---|
| Header fixo | — | Logo; navegação Benefícios · Como Funciona · Calculadora de Retorno · Dúvidas Frequentes; "Já sou parceiro"; CTA "Cadastrar Restaurante" |
| Hero | — | "Transforme clientes casuais em **frequentadores fiéis**"; 4 bullets (zero mensalidade, leitura de cupom por IA, +35% de recorrência, dashboard em tempo real); CTAs "Cadastrar Meu Restaurante" e "Simular Faturamento"; selo "Aprovação rápida em até 24 horas úteis"; mock de painel com métricas |
| Como Funciona | `#como-funciona` | 4 passos: cadastrar (< 2 min) → configurar cashback (5% a 15%) ou campanhas → cliente grava a nota e a IA valida → cliente volta para resgatar |
| Calculadora | `#calculadora` | Simulador de impacto financeiro (§4.7) |
| Benefícios | `#beneficios` | 6 cards: modelo baseado em sucesso, IA para cupons, dashboard em tempo real, campanhas em horários ociosos, marketing segmentado, selo de parceiro recomendado |
| FAQ | `#faq` | 5 perguntas: custo (grátis, só comissão), integração com PDV (não precisa), prazo de aprovação (24 h úteis), escolha do % de cashback (sim), relatórios (dashboard exclusivo) |
| Footer | — | CTA "Cadastrar Gratuitamente", navegação, contato `comercial@loopis.app`, selo LGPD, redes sociais (`href="#"`), razão social "Loopis Tecnologias para Gastronomia Ltda" |

**Único ponto de conversão** — `RegisterModal` (`components/RegisterModal.tsx:11`):

| Campo | Tipo | Obrigatório | Opções/Default |
|---|---|---|---|
| Nome do Estabelecimento | texto | sim | — |
| Categoria | select | sim | Hambuergueria/Pub · Pizzaria · Japonesa/Asiática · Italiana/Massas · Churrascaria/Brasileira · Cafeteria/Doceria · Outro segmento |
| Nome do Responsável | texto | sim | — |
| E-mail Corporativo | e-mail | sim | — |
| WhatsApp | telefone | sim | — |
| Cidade / Estado | texto | sim | default "São Paulo - SP" |
| Capacidade / Estrutura | select | não | Até 10 mesas · 10 a 30 mesas · Mais de 30 mesas · Apenas Delivery / Dark Kitchen |

Consentimento: "Ao enviar, você autoriza o contato da equipe Loopis para ativação da sua conta."
Sucesso: "Cadastro Solicitado com Sucesso! Nossa equipe comercial entrará em contato com o
responsável **{nome}** via WhatsApp em breve."

`ℹ️ SIMULADO` — `handleSubmit` apenas alterna para a tela de sucesso (`:25-28`);
**nenhum dado é enviado** a API, CRM, e-mail ou webhook.

`⏳ PENDENTE` — posicionamento (hoje só restaurantes, sem as verticais tour/evento/locação),
destino do lead e presença de links para o PWA/painel serão refinados com o Cliente.

---

## 4. Regras de Negócio Críticas

### 4.1 Moeda de fidelidade "Loops"

| Regra | Valor implementado | Referência |
|---|---|---|
| Equivalência no resgate | **1 Loop = R$ 1,00 de abatimento** | `Loopis-Client/src/pages/CheckoutSplitPage.tsx:159`; `components/experience/BookTourModal.tsx:154` |
| Teto de uso por transação | `min(saldo do usuário, floor(valor total))` | `useSplitPayment.ts` / `ExperienceBookingModal.tsx:48` |
| Uso no split | **Bloqueado** — Loops só no pagamento integral; ao trocar para split o valor é zerado | `CheckoutSplitPage.tsx:74-80` |
| Saldo insuficiente | `completeClientPayment` retorna `false` e a transação é abortada com toast | `store/useStore.ts:853-857`; `useSplitPayment.ts:236-239` |
| Arredondamento | Loops sempre inteiros (`Math.floor` no uso, `Math.round` no crédito) | `store/useStore.ts:854-855` |
| Bônus de cadastro | **+50 Loops** (tipo `bonus`, "Bônus: Cadastro completo de conta") | `LoginModal.tsx:26-40`; `Auth.tsx:25-38` |
| Saldo inicial do mock | 850 Loops | `store/useStore.ts:710` |

### 4.2 Cashback (geração de Loops) — `⏳ PENDENTE`

**A regra oficial será definida posteriormente com o Cliente.** O comportamento atualmente
implementado é o seguinte:

| Contexto | Fórmula implementada | Referência |
|---|---|---|
| Comanda de restaurante (resumo) | `round(netPayable × 1.0)` — **1 Loop por R$ 1** | `hooks/useOrderSummary.ts:97` |
| Pagamento integral no checkout | `round(valor pago em dinheiro)` — 1:1 | `hooks/useSplitPayment.ts:229` |
| Fração paga no split | `round(valor da fração)` — 1:1 | `hooks/useSplitPayment.ts:179` |
| Encerramento pelo parceiro | `floor(total da comanda)` — 1:1 | `store/useStore.ts:613` |
| Compra de experiência/tour/locação/ingresso | `round(valor após Loops × cashbackPercent / 100)` — **10% a 25%** | `ExperienceBookingModal.tsx:53`; `BookTourModal.tsx:39`; `SelectTicketsSheet.tsx:29` |
| Pacote com cross-sell (estimativa exibida) | `round(total do pacote × cashbackPercent da experiência / 100)` | `ExperienceDetailView.tsx:216` |
| Parâmetro global do admin | `defaultCashbackPercent = 1` (%) | `Loopis/src/store/useStore.ts:510` |
| Simulador comercial | 10% fixo sobre o GMV | `services/mockApi.ts:545` |
| Calculadora da landing | 10% sobre o faturamento extra | `Loopis-landing-page/src/components/CalculatorSection.tsx:13` |

O `cashbackPercent` é **por parceiro/experiência** e varia de **10% a 25%** no catálogo atual
(ver §6.2). Cada oferta de cross-sell também carrega o seu próprio `cashbackPercent`, hoje **não
utilizado no cálculo** do pacote.

### 4.3 Cálculo financeiro da comanda

```
subtotal            = Σ (item.quantity × item.unitPrice)
descontoBase        = order.appliedDiscount.amount        // reserva | campanha | cupom da casa
descontoCupom       = cupom.percentual ? subtotal × valor/100 : min(subtotal, valorFixo)
taxaServico         = order.serviceChargeAmount           // 10% sugerido
totalLiquido        = max(0, subtotal − descontoBase − descontoCupom + taxaServico)
```
`hooks/useOrderSummary.ts:83-106`. A economia total exibida é `descontoBase + descontoCupom`.
No painel, a taxa de serviço é aplicada como **10% fixo** (`ManualEntry.tsx:54`;
`RestaurantKanbanView.tsx:59`).

**Tipos de desconto na comanda** (`types/billing.ts:20-25`): `reservation` (benefício da reserva),
`coupon` (cupom) e `campaign` (campanha do parceiro).

### 4.4 Cupons

| Regra | Implementação |
|---|---|
| Tipos | `percentage` (% sobre o subtotal) e `fixed` (valor fixo, limitado ao subtotal) |
| Normalização | código convertido para maiúsculas e `trim` antes da validação |
| Não encontrado | "Cupom não encontrado. Verifique a ortografia do código." |
| Inválido/expirado | usa `errorMessage` do cupom ou "Este cupom não está mais ativo." |
| Escopo | assinatura aceita `restaurantId`, mas o parâmetro **não é usado** na validação |
| Cupom de promoter | gerado pelo parceiro de evento, com % de desconto próprio e comissão vinculada |

`services/mockApi.ts:160-195` e `:367-393`.

### 4.5 Regras por vertical de parceiro

| Regra | Restaurante | Tour | Evento | Locação |
|---|---|---|---|---|
| Ação de conversão | Reserva de mesa | Reserva de vaga em saída | Compra de ingresso por lote | Reserva de ativo por hora |
| Momento do pagamento | **No local, após o consumo** | Antecipado no app | Antecipado no app | Antecipado no app |
| Unidade | pessoas | passageiros/vagas | ingressos | horas/unidades |
| Limite de capacidade | `minGuests`/`maxGuests` | `maxCapacityPerSlot` | `availableQuantity` por lote | `availableUnits` |
| Dado obrigatório extra | — | documento/telefone dos passageiros; contato de emergência no manifesto | titular nominal do ingresso | participantes autorizados; duração |
| Requisito operacional | tolerância de 15 min (config. padrão) | termo de responsabilidade | ingressos nominais + validação na portaria | **caução** para equipamentos motorizados |
| Comprovante | comanda + pagamento | voucher `LOOP-TOUR-#####` | voucher `LOOP-EVT-#####` | voucher `LOOP-LOC-#####` |
| Validação presencial | check-in no app / painel | Validador de Embarque | Validador de Portaria | Validador de Retirada |
| Ferramenta exclusiva no painel | Kanban de mesas e comandas | Manifesto + Guias/Embarcações | Lotes/Setores + Promoters | Grade de ativos + Bloqueios de manutenção/clima |

Fontes: `types/experience.ts`, `types/partner.ts`, `constants/navigation.ts`,
`pages/partner/*`, `components/experience/*`.

### 4.6 Regras do Split Payment (`hooks/useSplitPayment.ts`)

| # | Regra | Implementação |
|---|---|---|
| 1 | Mínimo de 2 e máximo de 12 partes iguais | `Math.max(2, Math.min(12, parts))` (`:76`) |
| 2 | Não é possível ficar com menos de 2 participantes | bloqueio com toast "O split precisa ter no mínimo 2 participantes." (`:114-117`) |
| 3 | Divisão igual sem perda de centavos | a última parte absorve a diferença (`:39-49`) |
| 4 | Modo customizado | edição livre por participante; valores negativos são zerados (`:127-129`) |
| 5 | Controle de saldo | `unallocatedDifference` e `isBalanced` (tolerância ±R$ 0,05) são calculados (`:296-301`) — **não bloqueiam** o fechamento |
| 6 | Tipos de participante | `me` (organizador), `app_user` (vinculado por busca), `guest` (sem conta) |
| 7 | Cobrança por participante | payload Pix + QR + link de pagamento + compartilhamento por WhatsApp (`:284-292`) |
| 8 | Crédito de Loops | creditado na carteira **apenas quando o organizador paga**; para `app_user`/`guest` apenas mensagem informativa (`:171-207`) |
| 9 | Conclusão | quando todas as frações são pagas: confete + modal "Conta 100% Liquidada" (`:208-212`) |
| 10 | Progresso | `% pago`, valor pago, restante e contagem de participantes pagos (`SplitProgressBar`) |

Regras equivalentes no painel (`RestaurantKanbanView.tsx:87-93`, `:251-273`): divisão em N partes
com distribuição de centavos, vínculo opcional de cada parte a um usuário Loopis e crédito de
`floor(valor)` Loops somente para partes com usuário vinculado.

### 4.7 Regras comerciais B2B

**Motor global** (`Loopis/src/pages/admin/Settings.tsx`): comissão base sobre GMV,
cashback padrão, **teto de desconto máximo** (anti-dumping para campanhas de parceiros),
cidade ativa e chave liga/desliga da praça.

**Contrato por parceiro** (`hooks/useRestaurantBilling.ts` + `services/mockApi.ts:536-556`):

```
comissaoLoopis   = GMV × commissionPercent / 100
mensalidade      = hasMonthlyFee ? monthlyFeeAmount : 0
repasseLiquido   = max(0, GMV − comissaoLoopis − mensalidade)
loopsAoCliente   = acceptsLoopCredits ? round(GMV × loopConversionRate × 0,10) : 0
```

Contratos de exemplo: Marisqueira Sintra (mensalidade R$ 249,90 + comissão 12,5%, vencimento dia 10)
e Boteco ORI (sem mensalidade, comissão 15%, vencimento dia 15); fallback de novos parceiros:
sem mensalidade, comissão 12%, `loopConversionRate` 1,0, vencimento dia 10
(`services/mockApi.ts:246-278`, `:480-502`).

**Calculadora de retorno da landing** (`CalculatorSection.tsx:8-13`):

```
faturamentoAtual   = ticketMedio × clientesPorMes
clientesExtras     = round(clientesPorMes × aumentoRecorrencia/100)
faturamentoExtra   = clientesExtras × ticketMedio
faturamentoTotal   = faturamentoAtual + faturamentoExtra
cashbackGerado     = round(faturamentoExtra × 0,10)
```
Faixas dos sliders: ticket R$ 20–300 (default 85) · clientes 100–3.000 (default 450) ·
aumento de recorrência 10–50% (default 25%, rotulado "Média Loopis").

**Compromissos comerciais declarados**: sem taxa de adesão e sem mensalidade (landing/FAQ);
aprovação em até 24 horas úteis; parceiro define o % de cashback (5% a 15% na landing);
"Sem taxa de setup para os 100 primeiros parceiros" (onboarding do painel).

### 4.8 Ciclo de vida das entidades

**Reserva** (`ReservationStatus` — `types/index.ts`):
`pending → confirmed → checked_in → completed`, com desvios `no_show` e `cancelled`.
No PWA, a reserva criada é auto-confirmada em 2 s (`store/useStore.ts:812-817`).

**Reserva/compra do cliente** (`ClientBookingStatus`):
`confirmed → checked_in → completed`, com `cancelled`.
Pagamento: `paid` · `pay_at_venue` · `awaiting_payment`.

**Comanda** (`ComandaRecord.status`): `aberta → aguardando_pagamento → paga`, com `cancelada`.
Formas de pagamento: `pix | cartao | split | loops | dinheiro`.
Origem de emissão: `restaurante | cliente`.

**Pedido/Order** (`OrderStatus`): `open → pending_payment → partially_paid → paid`, com `cancelled`.

**Sessão de split** (`SplitPaymentSession.status`): `open → partial → completed`
(recalculada a cada pagamento em `services/mockApi.ts:435-476`).

**Solicitação de parceria** (`PartnerRequest.status`): `pending → approved | rejected`.

**Parceiro** (`Restaurante.status`): `pendente | aprovado` (o filtro do admin oferece também
"bloqueado", não previsto no tipo).

**Avaliação** (`ReviewStatus`): `pending → approved | hidden | rejected`.

**Cupom fiscal auditado** (`CupomFiscal.statusValidacao`):
`pendente | aprovado | divergente | duplicado`.

**Ingresso na portaria** (`TicketStatus`): `valido → validado`; 2ª leitura → `duplicado`;
`cancelado` bloqueia.

**Presença** (`PartnerActivityRecord.statusPresenca`):
`compareceu | no_show | em_andamento | cancelada`.

### 4.9 Regras de conteúdo e reputação

- Avaliação exige **visita concluída** (nasce de uma notificação vinculada a uma reserva/compra),
  nota de 1 a 5 e comentário com **≥ 10 caracteres**; uma avaliação por notificação.
- Toda avaliação entra como `pending` e **só aparece publicamente após moderação do parceiro**.
- O parceiro pode Publicar, Ocultar ou Rejeitar; não pode editar o conteúdo.
- A ficha do parceiro exibe, além das avaliações internas aprovadas, um bloco de
  "Avaliações do Google" (mock).

### 4.10 Regras de escopo geográfico

Operação restrita a **Florianópolis - SC**: `systemConfig.activeCity` com toggle de praça ativa
(`Loopis/src/store/useStore.ts:513-514`) e o tipo `FlorianopolisAddress` com
`city: 'Florianopolis'` e `state: 'SC'` **literais** (`types/partner.ts:18-19`).
O catálogo cobre 7 bairros curados (§6.1).

---

## 5. Inventário de Rotas, Endpoints & Entidades

### 5.1 Rotas — Loopis-Client (PWA) — `src/routes.tsx`

| Rota | Componente | Acesso | Linha |
|---|---|---|---|
| `/` | `Home` → `GuestLandingPage` | público | 32 |
| `/auth` | `Auth` | público | 33 |
| `/experiencias` | `ExperiencesPage` | público | 34 |
| `/experience/:id` | `ExperienceDetailView` | público | 35 |
| `/experiencias/:id` | `ExperienceDetailView` | público | 36 |
| `/parceiro/:id` | `PartnerProfilePage` | público | 37 |
| `/restaurante/:id` | `RestaurantDetails` | público (CTA exige login) | 38 |
| `/notificacoes` | `NotificationsPage` | público* | 39 |
| `/avaliar/:notificationId` | `ReviewExperiencePage` | exige login (bloqueio na tela) | 40 |
| `/reserva/checkin` | `CheckIn` | exige login (bloqueio na tela) | 41 |
| `/carteira` | `Wallet` | público* | 42 |
| `/descontos` → `/carteira` | redirect | — | 43 |
| `/descontos/:id/resgate` → `/carteira` | redirect | — | 44 |
| `/cupons` | `Coupons` | público* | 45 |
| `/carteira/ler-cupom` | `ScanReceipt` | público* | 46 |
| `/perfil` | `Profile` | exige login (bloqueio na tela) | 47 |
| `/regulamento` | `Rules` | público | 48 |
| `/scanner` | `ScannerPage` | público* | 51 |
| `/order-summary?code=` | `OrderSummaryPage` | público* | 52 |
| `/checkout/split?orderCode=&netTotal=&tab=` | `CheckoutSplitPage` | público* | 55 |
| `/admin/restaurant/settings` | `RestaurantBillingSettingsPage` | público* (tela B2B) | 58 |

\* Sem guard de rota: acessível por URL direta mesmo deslogado.

**Query params relevantes**: `code` (comanda), `orderCode`, `netTotal`, `subtotal`, `discount`,
`tab` (`full` | `split`), `redirect` (auth).

### 5.2 Rotas — Loopis (Painel) — `src/routes.tsx`

| Rota | Componente | Perfil | Linha |
|---|---|---|---|
| `/` e `/login` | `Login` | público | 52, 56 |
| `/scanner` | `ScannerPage` | — | 61 |
| `/order-summary` | `OrderSummaryPage` | — | 62 |
| `/checkout/split` | `CheckoutSplitPage` | — | 63 |
| `/admin/dashboard` | `PartnerOverview` (em `PartnerLayout`) | Parceiro | 67 |
| `/admin/dashboard/configuracoes` | `PartnerAccountSettings` | Parceiro | 71 |
| `/admin/dashboard/clientes` | `PartnerClientsView` | Parceiro | 72 |
| `/admin/dashboard/avaliacoes` | `PartnerReviewsModerationView` | Parceiro | 73 |
| `/admin/dashboard/cardapio` → `/configuracoes` | redirect | Parceiro | 74 |
| `/admin/dashboard/loops` → `/admin/dashboard` | redirect | Parceiro | 75 |
| `/admin/dashboard/mesas-reservas` | `RestaurantKanbanView` | Restaurante | 76 |
| `/admin/dashboard/agenda-saidas` | `TourScheduleView` | Tour | 77 |
| `/admin/dashboard/manifesto` | `TourPassengerManifestView` | Tour | 78 |
| `/admin/dashboard/guias-equipamentos` | `TourGuidesFleetView` | Tour | 79 |
| `/admin/dashboard/lotes-ingressos` | `EventTicketTierView` | Evento | 80 |
| `/admin/dashboard/portaria` | `EventGateValidatorView` | Evento/Tour/Locação | 81 |
| `/admin/dashboard/promoters` | `EventPromotersCommissionView` | Evento | 82 |
| `/admin/dashboard/grade-horaria` | `RentalAssetsView` | Locação | 83 |
| `/admin/dashboard/bloqueios` | `RentalMaintenanceView` | Locação | 84 |
| `/admin/dashboard/*` | `PartnerPlaceholderView` | Parceiro | 85 |
| `/restaurante` → `/restaurante/dashboard` | redirect | Restaurante legado | 94 |
| `/restaurante/dashboard` | `Dashboard` | Restaurante legado | 95 |
| `/restaurante/onboarding` | `Onboarding` | Restaurante legado | 96 |
| `/restaurante/reservas` | `Reservations` | Restaurante legado | 97 |
| `/restaurante/atividades` | `ActivityLog` | Restaurante legado | 98 |
| `/restaurante/campanhas` | `Campaigns` | Restaurante legado | 99 |
| `/restaurante/lancamento` | `ManualEntry` | Restaurante legado | 100 |
| `/restaurante/ler-cupom` | `ScanReceiptRes` | Restaurante legado | 101 |
| `/restaurante/configuracoes` | `Settings` | Restaurante legado | 102 |
| `/restaurante/comercial` | `RestaurantBillingSettingsPage` | Restaurante legado | 103 |
| `/admin` → `/admin/dashboard` | redirect | Admin | 112 |
| `/admin/dashboard-admin` | `Dashboard` (admin) | Admin | 113 |
| `/admin/aprovacoes` | `Approvals` | Admin | 114 |
| `/admin/restaurantes` | `Restaurants` | Admin | 115 |
| `/admin/clientes` | `Clients` | Admin | 116 |
| `/admin/cobrancas` | `Billing` | Admin | 117 |
| `/admin/pontuacao` | `ScoreConfig` | Admin | 118 |
| `/admin/auditoria` | `AuditReceipts` | Admin | 119 |
| `/admin/configuracoes` | `Settings` (admin) | Admin | 120 |
| `/admin/restaurant/settings` · `/admin/restaurant-settings` | `RestaurantBillingSettingsPage` | Admin | 121-122 |
| `*` → `/login` | fallback | — | 125 |

### 5.3 Landing page — âncoras
`#beneficios` · `#como-funciona` · `#calculadora` · `#faq` (+ `#cadastro`, referenciada sem destino).

### 5.4 "Endpoints" — contrato de serviço simulado (`services/mockApi.ts`)

| Operação | Assinatura | Latência | Comportamento |
|---|---|---|---|
| Ler comanda | `fetchOrderReceipt(rawCode: string): Promise<Order>` | 750 ms | Retorna `Order` ou lança erro com `code` (§3.A.8) |
| Validar cupom | `validateCoupon(code, restaurantId?): Promise<{valid, coupon?, error?}>` | 500 ms | Busca no catálogo, verifica `isValid` |
| Buscar usuários | `searchUsers(query): Promise<UserSearchResult[]>` | 300 ms | Match em nome, username, telefone e e-mail |
| Criar/atualizar split | `createOrUpdateSplitSession(session): Promise<SplitPaymentSession>` | 400 ms | Grava em cache em memória com `updatedAt` |
| Obter split | `getSplitSession(sessionId): Promise<SplitPaymentSession \| null>` | 250 ms | — |
| Marcar fração paga | `markParticipantPaid(sessionId, participantId, method='pix')` | 500 ms | Recalcula pago/restante/% e status `partial \| completed` |
| Ler config. comercial | `getRestaurantBillingSettings(restaurantId)` | 400 ms | Retorna contrato ou fallback |
| Salvar config. comercial | `saveRestaurantBillingSettings(settings)` | 650 ms | Valida (§3.D.9) e persiste em memória |
| Projeção comercial | `calculateCommercialProjection(gmv, settings)` | síncrono | Comissão, mensalidade, repasse e Loops |

### 5.5 Estado global (store `zustand`) — contrato

**Comum aos dois apps** — `currentRole`, `setRole`, `restaurants`, `isLoggedIn`, `isLoginModalOpen`,
`openLoginModal`, `closeLoginModal`, `login`, `logout`, `loopsBalance`, `transactions`, `rewards`,
`activeReservation`, `createReservation`, `updateReservationStatus`, `redeemReward`,
`b2bReservations`, `updateB2bReservationStatus`, `processBilling`, `customPromotions`,
`addCustomPromotion`, `partnerRequests`, `systemConfig`, `tabelaPontuacao`, `auditCuponsFiscais`,
`updateSystemConfig`, `approvePartnerRequest`, `rejectPartnerRequest`.

**Exclusivo do PWA** — `notifications`, `internalReviews`, `clientBookings`, `friends`,
`friendInvites`, `sendFriendInvite`, `acceptFriendInvite`, `rejectFriendInvite`, `removeFriend`,
`completeClientPayment`, `markNotificationRead`, `markAllNotificationsRead`, `submitReview`,
`updateClientBookingStatus`.

**Exclusivo do Painel** — `currentPartnerType`, `setPartnerType`, `menuItems`, `addMenuItem`,
`removeMenuItem`, `comandas`, `addComanda`, `updateComandaStatus`, `partnerActivities`,
`addPartnerActivity`.

Persistência: `localStorage['loopis-storage']`, com `merge` customizado que preserva os
restaurantes default e acrescenta os persistidos (`store/useStore.ts:1011-1025`).

### 5.6 Modelo de dados implícito

#### 5.6.1 Identidade e relacionamento

| Entidade | Campos-chave | Arquivo |
|---|---|---|
| `User` | `id`, `nome`, `email`, `telefone`, `cidade`, `statusCadastro (simplificado\|completo)`, `origemLogin (email\|google\|facebook\|apple)`, `loopsSaldo`, `historicoAcessos[]` | `types/index.ts` |
| `Friend` | `id`, `userId`, `name`, `username`, `phone`, `email`, `avatarUrl`, `loopsBalance`, `since`, `status ('accepted')` | `types/index.ts` |
| `FriendInvite` | + `direction (sent\|received)`, `status (pending\|accepted\|rejected)`, `createdAt` | `types/index.ts` |
| `UserSearchResult` | `id`, `name`, `username`, `phone`, `email`, `avatarUrl`, `loopsBalance` | `types/billing.ts` |

#### 5.6.2 Parceiros e catálogo

| Entidade | Campos-chave |
|---|---|
| `Restaurante` | `id`, `nome`, `tipoParceiro?`, `endereco`, `categoria`, `status (pendente\|aprovado)`, `horarioFuncionamento`, `fotosMenu[]`, `fotosGaleria[]`, `cardapio?`, `experienciaDetalhes?`, `tourDetalhes?`, `eventoDetalhes?`, `showDetalhes?`, `videoUrl?`, `redesSociais?`, `avaliacoesGoogle[]`, `rating?`, `distance?`, `promotion?`, `imageUrl?`, `location?` |
| `MenuItem` | `id`, `nome`, `descricao?`, `preco`, `imagemUrl`, `categoria?` |
| `GuestRestaurant` | `id`, `name`, `category`, `macroCategory?`, `rating`, `reviewsCount`, `estimatedTime?`, `priceRange ($..$$$$)`, `imageUrl`, `logoUrl?`, `location`, `address`, `cashbackPercent`, `promotionBadge?`, `featuredBadge?`, `isPopular?`, `isWeeklyHighlight?` |
| `Category` / `PartnerMacroCategory` | `id`, `name`, `iconName`, `count?`, `macroCategory?` / `'Todos' \| 'Restaurantes & Gastronomia' \| 'Eventos/Shows' \| 'Tours/Roteiros' \| 'Experiências' \| 'Outros'` |
| `NeighborhoodInfo` | `id`, `name`, `tagline`, `description`, `imageUrl`, `badge`, `highlights[]`, `vibe`, `partnersCount`, `experiencesCount` |
| `AdBanner` | `id`, `type (hero\|interstitial\|sponsored)`, `title`, `subtitle?`, `badge?`, `imageUrl`, `targetUrl?`, `ctaText?`, `sponsorName?`, `gradientColor?` |
| `Experience` (catálogo) | `id`, `title`, `subtitle`, `partnerId`, `partnerName`, `macroCategory`, `type`, `neighborhood`, `address`, `imageUrl`, `galleryUrls?`, `duration`, `rating`, `reviewsCount`, `price`, `cashbackPercent`, `loopsRedeemCost`, `badges?`, `includedItems[]`, `description`, `scheduleInfo`, `maxParticipants?`, **`linkedRestaurants?`**, **`linkedRentals?`** |
| `ExperienceDetail` (união discriminada) | `partner_type` + `primaryAction` + bloco `reservation` \| `slotBooking` \| `ticketPurchase` |
| `LinkedRestaurantOption` | `id`, `restaurantId`, `name`, `category`, `location`, `imageUrl`, `pricePerPerson`, `cashbackPercent`, `specialBenefit`, `scheduleMode (client_choice\|fixed)`, `fixedDateTime?`, `availableTimes?`, `description?` |
| `LinkedRentalOption` | `id`, `title`, `partnerName`, `imageUrl`, `price`, `unitLabel`, `cashbackPercent`, `description`, `scheduleMode`, `fixedDateTime?`, `availableSlots?` |
| `ExperienciaDetalhes` / `TourDetalhes` / `EventoDetalhes` / `ShowDetalhes` | blocos legados por vertical (inclusos, duração, preço/pessoa, vagas, dias; ponto de encontro, roteiro, horários de saída, idioma do guia; data, horários, local, atrações, lotes; artista, data, horário, couvert, tipo de assento, gênero musical) |

#### 5.6.3 Transação e operação

| Entidade | Campos-chave |
|---|---|
| `Reservation` | `id`, `restaurantId`, `restaurantName`, `partnerType?`, `date`, `time`, `guests`, `promotionSelected`, `status`, `clientName?`, `clientPhone?`, `checkInTimestamp?` |
| `ClientBooking` | `id`, `partnerType`, `partnerId`, `partnerName`, `productName`, `neighborhood`, `imageUrl`, `date`, `time`, `quantity`, `quantityLabel`, `status`, `paymentStatus`, `total`, `loopsUsed`, `loopsEarned`, `voucherCode?`, `reviewNotificationId?` |
| `ComandaRecord` / `ComandaItem` | `comandaCode`, cliente (nome/telefone/CPF), `mesaOuReferencia`, `data`, `horario`, `itens[]`, `subtotal`, `taxaServico`, `descontoLoops`, `total`, `status`, `formaPagamento?`, `fotoCupomUrl?`, `qrCodeData?`, `origemEmissao` |
| `Order` / `OrderItem` | `code`, `tableNumber?`, restaurante, `serverName?`, `createdAt`, `status`, `items[]`, `subtotal`, `serviceChargePercent?`, `serviceChargeAmount?`, `appliedDiscount {type, description, percentage?, amount}`, `totalPayable` |
| `Coupon` | `code`, `description`, `discountType`, `discountValue`, `minOrderValue?`, `expiresAt`, `isValid`, `restaurantId?`, `errorMessage?` |
| `SplitPaymentSession` | `orderId/Code`, restaurante, `originalSubtotal`, `discountAmount`, `loopCreditsApplied`, `loopDiscountAmount`, `finalTotalAmount`, `splitMode (full\|equal\|custom)`, `totalParts`, `participants[]`, `totalPaidAmount`, `remainingAmount`, `progressPercentage`, `status`, `createdAt`, `updatedAt` |
| `SplitParticipant` | `id`, `name`, `assignedType (me\|app_user\|guest)`, contato, `amount`, `percentage`, `isPaid`, `paidAt?`, `paymentMethod? (pix\|credit_card\|loop_credits)`, `pixQrCodePayload?`, `paymentUrl` |
| `Transaction` | `id`, `date`, `amount`, `type (earn\|redeem\|bonus)`, `description` |
| `Reward` | `id`, `title`, `description`, `cost`, `restaurantId?`, `restaurantName?` |
| `Campanha` | `id`, `restauranteId`, `tipo (porcentagem\|valor_fixo\|cashback_dobro)`, `valor`, `regraHorario`, `status (ativa\|inativa\|agendada)`, `imagemUrl?` |
| `PartnerActivityRecord` | `partnerId`, `partnerNome`, `tipoParceiro`, `data`, `horario`, cliente, `reservaId?`, `statusPresenca`, `horarioCheckin?`, `pessoasQtd`, `comanda?`, `totalGasto`, `loopsGerados`, `beneficioUtilizado?` |

#### 5.6.4 Governança e back-office

| Entidade | Campos-chave |
|---|---|
| `PartnerRequest` | `id`, `name`, `partnerType?`, `category`, `address`, `phone`, `status`, `requestDate`, `detailsSummary?`, `cardapio?`, `fotosGaleria?` |
| `SystemConfig` | `defaultCashbackPercent`, `maxDiscountAllowed`, `loopisCommissionPercent`, `activeCity`, `isCityActive` |
| `TabelaPontuacao` | `id`, `acao (cadastro_completo\|reserva\|checkin\|indicacao)`, `valorEmLoops` |
| `CupomFiscal` | `id`, `consumoId`, `fotoUrl`, `valorLidoIa`, `lidoPor (cliente\|restaurante)`, `statusValidacao`, `clienteNome?`, `dataEmissao?` |
| `RestaurantBillingSettings` | `restaurantId/Name`, `hasMonthlyFee`, `monthlyFeeAmount`, `commissionPercent`, `acceptsLoopCredits`, `loopConversionRate`, `invoiceDueDay`, `bankAccountInfo?`, `updatedAt` |
| `CommercialSimulationResult` | `simulatedGmv`, `loopisCommissionAmount`, `monthlyFeeTotal`, `netRestaurantPayout`, `estimatedCustomerCashbackLoops` |
| `AppNotification` | `id`, `type ('review_request')`, `title`, `message`, `partnerId/Name`, `experienceId?/Name`, `partnerRoute`, `createdAt`, `read`, `reviewId?` |
| `InternalReview` | `id`, `notificationId?`, `partnerId/Name`, `experienceId?/Name`, `userName`, `rating`, `comment`, `status`, `createdAt` |

#### 5.6.5 Onboarding de parceiro (contrato tipado, `types/partner.ts`)

```ts
BasePartnerOnboarding = {
  document, documentType: 'cnpj' | 'cpf', legalName, tradeName, phone,
  address: FlorianopolisAddress, photos[], payoutBankData: BankTransferData
}
PartnerRegistrationPayload = BasePartnerOnboarding & (
  | { partner_type: 'restaurante', restaurant: { tableCount, acceptsReservations,
        defaultServiceFeePercent, orderModel: 'physical' | 'digital' } }
  | { partner_type: 'tour',        tour: { meetingPoint {label, lat, lng},
        maxCapacityPerDeparture, includedItems[], excludedItems[], requiresLiabilityWaiver } }
  | { partner_type: 'evento',      event: { ageRating: 'free'|'10'|'12'|'14'|'16'|'18',
        totalCapacity, usesNominalTickets, gateOpeningTimes[] } }
  | { partner_type: 'rental',      rental: { availableUnits, minimumRentalHours,
        securityDepositAmount } }
)
BankTransferData = { bankName, bankCode?, agency, accountNumber, accountDigit?,
                     accountType: 'checking'|'savings'|'payment', pixKey?, documentHolder }
```

Type guards disponíveis: `isRestaurantPayload`, `isTourPayload`, `isEventPayload`, `isRentalPayload`.

### 5.7 Entidades locais de tela (ainda sem tipo compartilhado)

`TourItem`, `TourResource`, `Departure`, `Passenger`, `EventItem`, `GateTicket`, `Promoter`,
`PromoterSale`, `RentalAsset`, `MaintenanceBlock`, `ModerationReview`, `ClientHistoryItem`,
`SplitUser`, `PixCharge`, `ScannedFiscalData`, `DiscoveryItem`.

---

## 6. Anexo A — Catálogo de Dados (mock)

Base de dados de demonstração usada pelas telas. Fonte: `Loopis-Client/src/mocks/guestData.ts` e
`Loopis-Client/src/store/useStore.ts`.

### 6.1 Bairros curados (`mockNeighborhoods:22`)

| Bairro | Badge | Vibe | Parceiros | Experiências |
|---|---|---|---|---|
| Santo Antônio de Lisboa | Sunset & Frutos do Mar | Romântico & Cultural | 6 | 3 |
| Lagoa da Conceição | Vida Noturna & Náutica | Vibrante & Cosmopolita | 8 | 4 |
| Centro & Beira-Mar | Gastronomia Premium | Sofisticado & Urbano | 7 | 2 |
| Jurerê Internacional | Luxo & Beach Club | Exclusivo & Trendy | 5 | 2 |
| Campeche & Sul da Ilha | Praia & Lifestyle | Descontraído & Natureza | 5 | 2 |
| Ribeirão da Ilha | Capital Nacional da Ostra | Bucólico & Gastronômico | 4 | 2 |
| Barra da Lagoa | Tradição & Camarão | Típico & Aventureiro | 4 | 2 |

Macro-categorias (`mockMacroCategories:3`): Todos (36) · Restaurantes & Gastronomia (22) ·
Experiências (8) · Tours/Roteiros (6) · Eventos/Shows (5) · Outros (3).
Categorias gastronômicas (`mockCategories:12`): Todos (28) · Frutos do Mar (8) · Hamburguerias (6) ·
Italiana & Pizzas (7) · Japonesa & Fusion (5) · Bares & Petiscos (9) · Cafés & Bistrôs (4).

### 6.2 Parceiros do catálogo guest (`mockGuestRestaurants:612`)

| Parceiro | Categoria | Bairro | Nota (avaliações) | Faixa | Cashback | Selo |
|---|---|---|---|---|---|---|
| Marisqueira Sintra | Frutos do Mar | Santo Antônio de Lisboa | 4,9 (342) | $$$ | 20% | Mais Avaliado |
| Boteco ORI | Bares & Petiscos | Lagoa da Conceição | 4,8 (289) | $$ | 15% | Favorito do Happy Hour |
| O Timoneiro | Frutos do Mar | Barra da Lagoa | 4,9 (512) | $$$ | 25% | Destaque da Semana |
| Soul Burger Artesanal | Hamburguerias | Campeche & Sul da Ilha | 4,7 (195) | $$ | 15% | Top Hambúrguer |
| Forneria Luce Napoletana | Italiana & Pizzas | Lagoa da Conceição | 4,9 (420) | $$$ | 20% | Melhor Pizza da Ilha |
| Nikkei Fusion & Sushi Prime | Japonesa & Fusion | Centro & Beira-Mar | 4,8 (310) | $$$$ | 20% | Experiência VIP |
| Café Cultura & Bistrô | Cafés & Bistrôs | Lagoa da Conceição | 4,7 (178) | $ | 10% | Brunch & Café |
| Rancho Açoriano Gastronomia | Frutos do Mar | Ribeirão da Ilha | 4,9 (650) | $$$$ | 20% | Tradição da Ilha |

O store possui ainda 12 restaurantes (`mockRestaurants:61`) com endereço completo, horário,
promoção e galeria — usados nas telas de detalhe, chatbot e painel.

### 6.3 Experiências (`mockExperiences:109`)

| ID | Título | Vertical inferida | Bairro | Preço | Cashback | Loops p/ resgate | Cross-sell |
|---|---|---|---|---|---|---|---|
| `tour-churrasco-chao` | Tour Churrasco de Chão & Roteiro Gastronômico | Tour | Campeche & Sul da Ilha | R$ 180 | 20% | 900 | 2 restaurantes + 2 locações |
| `event-sunset-churrasco` | Festival Sunset Churrasco & Craft Beer | Evento | Centro & Beira-Mar | R$ 120 | 20% | 600 | 2 restaurantes + 2 locações |
| `exp-2` | Passeio de Lancha na Costa da Lagoa + Almoço | Tour | Lagoa da Conceição | R$ 240 | 25% | 1200 | 1 restaurante + 2 locações |
| `exp-1` | Sunset VIP: Ostras & Espumante no Deck | Restaurante | Santo Antônio de Lisboa | R$ 160 | 20% | 800 | — |
| `exp-3` | Menu Omakase 7 Passos com Saquê | Restaurante | Centro & Beira-Mar | R$ 280 | 20% | 1400 | — |
| `exp-4` | Fazenda de Ostras no Barco + Banquete Açoriano | Tour | Ribeirão da Ilha | R$ 210 | 20% | 1050 | — |
| `exp-5` | Noite Italiana com Jazz ao Vivo | Evento | Centro & Beira-Mar | R$ 195 | 20% | 975 | — |
| `exp-6` | Workshop de Parrilla Uruguaia | Restaurante | Campeche & Sul da Ilha | R$ 180 | 15% | 900 | — |
| `exp-7` | Happy Hour Festival: Roda de Samba & Chopp | Evento | Lagoa da Conceição | R$ 90 | 15% | 450 | — |
| `exp-8` | Brunch & Café Especial no Jardim Secreto | Restaurante | Lagoa da Conceição | R$ 85 | 10% | 425 | — |
| `rental-beach-tennis`* | Arena Lagoa Beach Tennis por Hora | Locação | Lagoa da Conceição | R$ 90/h | 20% | 450 | — |
| `rental-jet-ski`* | Jet-ski Jurerê Express | Locação | Jurerê Internacional | R$ 220/h | 20% | 900 | — |

\* Definidos em `ExperienceDetailView.tsx:24` (não estão no catálogo principal).

### 6.4 Ofertas de cross-sell disponíveis

**Restaurantes vinculados** (`LinkedRestaurantOption`):

| Experiência | Restaurante | Preço/pessoa | Cashback | Benefício | Agendamento |
|---|---|---|---|---|---|
| `tour-churrasco-chao` | Costelaria & Parrilla Fogo de Chão | R$ 85 | 20% | Mesa VIP + Rodízio de Costela 12h | **Fixo** — Sábado 13:00–15:00 |
| `tour-churrasco-chao` | Boteco ORI - Estação Gourmet | R$ 55 | 15% | Chopp em dobro + Tábua de Torresmo | **Livre** — 12:30, 14:00, 15:30, 17:00 |
| `event-sunset-churrasco` | Trattoria Carbone - Estação Vinhos | R$ 75 | 20% | Massa Trufada + Taça de Vinho | **Fixo** — Sábado 19:00–20:30 |
| `event-sunset-churrasco` | Marisqueira Sintra - Lounge de Ostras | R$ 68 | 20% | Dúzia de Ostras + Espumante | **Livre** — 16:00, 17:30 (Sunset), 19:00, 20:30 |
| `exp-2` | O Timoneiro - Deck da Costa | R$ 95 | 25% | Sequência de Camarão + Mesa Panorâmica | **Fixo** — Almoço 12:30 |

**Locações vinculadas** (`LinkedRentalOption`):

| Experiência | Item | Preço | Unidade | Cashback | Agendamento |
|---|---|---|---|---|---|
| `tour-churrasco-chao` | Kit Conforto Lounge (2 cadeiras + tenda UV) | R$ 35 | por diária | 20% | **Fixo** — durante todo o roteiro |
| `tour-churrasco-chao` | Cooler Térmico Retrô com gelo e copos | R$ 25 | por kit | 20% | **Livre** — retirada 11:00 ou 13:00 |
| `event-sunset-churrasco` | Espaço Lounge VIP (até 4 pessoas) | R$ 90 | por lounge | 20% | **Fixo** — durante todo o evento |
| `event-sunset-churrasco` | Bicicleta Elétrica Beach Cruiser | R$ 40 | por hora | 20% | **Livre** — 3 janelas de 1 h |
| `exp-2` | Prancha de Stand-Up Paddle com remo e colete | R$ 45 | por hora | 20% | **Livre** — 3 janelas de 1 h |
| `exp-2` | Kit Snorkel & Máscara de Mergulho | R$ 25 | por pessoa | 20% | **Fixo** — entregue a bordo |

### 6.5 Comandas de demonstração (`services/mockApi.ts:11`)

| Código | Restaurante | Mesa | Subtotal | Taxa (10%) | Desconto | Total |
|---|---|---|---|---|---|---|
| `LOOP-8821` | Marisqueira Sintra | Mesa 14 (Salão Principal) | R$ 268,00 | R$ 26,80 | R$ 53,60 (Reserva 20%) | R$ 241,20 |
| `CMD-4091` | Boteco ORI | Mesa 08 (Varanda) | R$ 174,50 | R$ 17,45 | R$ 26,18 (Campanha Happy Hour 15%) | R$ 165,77 |
| `TIM-1092` | O Timoneiro | Mesa 22 (Deck Lagoa) | R$ 340,00 | R$ 34,00 | R$ 85,00 (Reserva VIP 25%) | R$ 289,00 |

### 6.6 Cupons (`services/mockApi.ts:160`)

| Código | Descrição | Tipo | Valor | Validade | Situação |
|---|---|---|---|---|---|
| `LOOP20` | 20% OFF na comanda no festival gastronômico | percentual | 20% | 31/12/2026 | válido |
| `PRIMEIRAVEZ` | 10% OFF no primeiro pagamento via Loopis | percentual | 10% | 31/12/2026 | válido |
| `CORTESIA30` | Abatimento fixo concedido pela casa | fixo | R$ 30,00 | 31/12/2026 | válido |
| `EXPIRADO` | Cupom de Natal 2025 | percentual | 25% | 25/12/2025 | inválido |

### 6.7 Banners publicitários (`mocks/guestData.ts:563`)

| ID | Tipo | Badge | Título | Destino |
|---|---|---|---|---|
| `hero-1` | hero | Festival Gastronômico | Ganhe até 25% de Cashback em Frutos do Mar | `/restaurante/marisqueira-sintra` |
| `hero-2` | hero | Menu Experiências | Sunsets, Degustações & Tours Exclusivos | `/experiencias` |
| `hero-3` | hero | Happy Hour em Dobro | Chopp Artesanal em Dobro & Petiscos Gourmet | `/restaurante/boteco-ori` |
| `interstitial-1` | intersticial | Patrocinador Oficial (Heineken & Eisenbahn Gourmet) | Chopp Premium & Experiência Gastronômica Exclusiva | `/experiencias` |

### 6.8 Demais conjuntos de demonstração

| Conjunto | Conteúdo |
|---|---|
| Usuários para split/amigos | 5 usuários com nome, @username, telefone, e-mail, avatar e saldo (45 a 840 Loops) |
| Reservas B2B (painel) | 12 reservas da Ostraria do Córrego entre 20 e 26/08/2026, cobrindo todos os status |
| Reservas/compras do cliente | 8 registros cobrindo as 4 verticais, com vouchers `LOOP-LOC-4812`, `LOOP-TOUR-8241`, `LOOP-EVT-5208`, `LOOP-EVT-1092`, `LOOP-TOUR-4412` |
| Solicitações de parceria | Sushi Floripa Experience (restaurante), Rota das Cervejarias Artesanais (tour) e outras |
| Recompensas | Sobremesa Grátis (150 Loops), R$ 50 de Desconto (500 Loops) |
| Cupons fiscais em auditoria | 2 registros (R$ 150,50 pendente/cliente; R$ 340,00 aprovado/restaurante) |
| Faturas B2B | 4 faturas de Julho/2026 com GMV de R$ 8.200 a R$ 21.000 e comissão de 10% |
| Cardápios do chatbot | 7 restaurantes com 3 a 5 pratos cada (nome, preço, descrição) |

---

## 7. Anexo B — Pendências para definição com o Cliente

| # | Tema | Situação atual | Impacto |
|---|---|---|---|
| 1 | **Regra oficial de cashback** | Três lógicas convivem: 1 Loop por R$ 1 (comanda/split), `cashbackPercent` de 10–25% (experiências) e 1% global no admin | Define a economia do produto: margem, passivo de Loops e comunicação ao cliente |
| 2 | **Tabela de pontuação** | Três versões divergentes (Regulamento do PWA, ScoreConfig do admin, `tabelaPontuacao` do store); só o bônus de +50 no cadastro é efetivamente creditado | Define a mecânica de engajamento e o custo de aquisição |
| 3 | **Execução do combo de cross-sell** | Requisito confirmado; hoje o pacote é montado e precificado, mas não é comprado nem gera os N vouchers | Bloqueia a principal alavanca de ticket médio |
| 4 | **Rateio de cashback no combo** | Aplica o % da experiência principal sobre o total; o `cashbackPercent` de cada item vinculado é exibido mas não usado | Afeta o acerto financeiro com cada parceiro do pacote |
| 5 | **Multiplicação do pacote por participante** | O adicional de restaurante é "por pessoa", mas o total não multiplica pela quantidade | Erro de precificação |
| 6 | **Posicionamento da landing** | Só comunica restaurantes; não cobre tour, evento e locação | Desalinhamento entre captação e produto |
| 7 | **Destino do lead da landing** | Formulário não envia dados a nenhum sistema | Nenhum lead é capturado hoje |
| 8 | **Links entre as três aplicações** | Não existem (landing ↔ PWA ↔ painel) | Quebra do funil |
| 9 | **Futuro do painel de restaurante legado** | Coexiste com o painel adaptativo, com sobreposição de funções | Define esforço de manutenção e treinamento |
| 10 | **Uso de Loops no split** | Bloqueado por decisão de produto explícita na interface | Confirmar se é definitivo |
| 11 | **Crédito de Loops para convidados** | Só o organizador recebe Loops; convidados recebem apenas mensagem | Define a proposta de valor do split |
| 12 | **Página de pagamento do convidado** | `/checkout/pay` é gerado nos links mas não existe | Bloqueia o fluxo guest |
| 13 | **Instalabilidade do PWA** | Sem manifest, service worker ou ícones | Define se "PWA" é entregável |
| 14 | **Expansão geográfica** | Cidade fixa em Florianópolis, inclusive no tipo `FlorianopolisAddress` | Define esforço para novas praças |
| 15 | **Autenticação, perfis e LGPD** | Sem autenticação, autorização ou consentimento; CPF e documentos trafegam em estado local | Pré-requisito para produção |

Detalhamento técnico de inconsistências, bugs e código morto:
[`PRD-ANEXO-INCONSISTENCIAS.md`](./PRD-ANEXO-INCONSISTENCIAS.md).
