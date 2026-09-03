# Notas de Engenharia Reversa — Ecossistema Loopis

> Documento de **anotações e observações brutas** levantadas na leitura integral do código-fonte
> das três aplicações do monorepo. Base para a posterior construção do `PRD.md`.
> Status: análise concluída — **aguardando validação e "go ahead"** para gerar o PRD.

---

## 0. Escopo lido

| App | Pasta | Linhas de código (src) | Arquivos |
|---|---|---|---|
| Painel Admin/Parceiro | `Loopis/` | ~17.5k | 89 |
| PWA do Consumidor | `Loopis-Client/` | ~16.4k | 76 |
| Landing Page | `Loopis-landing-page/` | ~1.3k | 13 |

Leitura: 100% de rotas, stores, tipos, services, hooks e páginas; componentes lidos integralmente
nos fluxos críticos (auth, descoberta, compra, cross-sell, comanda, split, onboarding, moderação).

---

## 1. Arquitetura real (o que o código diz)

### 1.1 Stack
- **3 aplicações React 19 + TypeScript + Vite 8 independentes**, sem workspace/monorepo tooling
  (não há `package.json` raiz, nem pnpm/turbo/nx). Cada pasta tem seu próprio `package-lock.json`.
- Tailwind CSS 4 (`@tailwindcss/vite`) + tokens de tema em `src/index.css`
  (`--color-brand-deep-purple #3D1E6D`, `--color-brand-violet #7C3AED`, `--color-brand-lilac #C4A1F5`,
  `--color-brand-graphite #2B2B2E`, `--color-brand-off-white #FAFAFC`; fonte `Inter` no app, `Plus Jakarta Sans` na landing).
- Roteamento: `react-router-dom` v7 (`createBrowserRouter`) — apenas nos dois apps de produto.
- Estado: `zustand` + `persist` (chave **`loopis-storage` idêntica nos dois apps**).
- Demais libs: framer-motion, lucide-react, recharts (admin/restaurante), qrcode.react,
  canvas-confetti, react-hook-form + zod (**apenas no Loopis, e só no `PartnerWizard`, que está morto**).

### 1.2 Comunicação entre as 3 aplicações: **não existe**
- **Não há backend, API, SDK compartilhado, variáveis de ambiente ou chamada HTTP real**
  (`grep` por `fetch(`, `axios`, `import.meta.env`, `VITE_` → zero ocorrências funcionais).
- Toda a "camada de serviço" é `src/services/mockApi.ts` com `setTimeout` simulando latência
  (250–750 ms) e dados em memória.
- **Não há link entre os apps**: a landing não aponta para o PWA nem para o painel;
  o PWA não aponta para o painel e vice-versa. São três SPAs isoladas.
- **Código duplicado por cópia** (não por pacote compartilhado): `store/useStore.ts`, `types/*`,
  `services/mockApi.ts`, `mocks/guestData.ts`, `hooks/useSplitPayment.ts`, `hooks/useOrderSummary.ts`,
  `hooks/useRestaurantBilling.ts`, `pages/ScannerPage`, `pages/OrderSummaryPage`,
  `pages/CheckoutSplitPage`, `pages/admin/RestaurantBillingSettingsPage` existem **nos dois apps**,
  com **divergências já acumuladas** (ver §7).

### 1.3 "PWA" é nominal
- `Loopis-Client/index.html` **não tem `manifest.json`**, não há service worker, nem ícones PWA,
  nem estratégia offline. `public/` só tem `favicon.svg`, `icons.svg` e imagens de restaurantes.
- O app é mobile-first (bottom nav, bottom sheets, `pb-safe`), mas **não é instalável** hoje.

---

## 2. Matriz de perfis e acessos (como está implementado)

### 2.1 Papéis existentes no código
| Papel | Onde vive | Como se entra | Rota inicial |
|---|---|---|---|
| **Visitante (deslogado)** | Loopis-Client | default (`isLoggedIn: false`) | `/` |
| **Cliente logado** | Loopis-Client | `login()` (qualquer submit) | `/` |
| **Parceiro — Restaurante** | Loopis | Login → seleciona vertical | `/admin/dashboard` |
| **Parceiro — Tour/Aventura** | Loopis | idem | `/admin/dashboard` |
| **Parceiro — Evento/Festa** | Loopis | idem | `/admin/dashboard` |
| **Parceiro — Locação/Quadras** | Loopis | idem | `/admin/dashboard` |
| **Restaurante (painel legado)** | Loopis | Login → "Cadastrar" → `/restaurante/onboarding` | `/restaurante/dashboard` |
| **Admin Loopis (Super Admin)** | Loopis | botão "Entrar como Administrador Loopis" | `/admin/dashboard-admin` |

`ProfileRole = 'client' | 'restaurant' | 'admin'` (`types/index.ts`).
`PartnerType = 'restaurante' | 'tour' | 'evento' | 'rental'` (`types/partner.ts`).

### 2.2 Observações críticas de acesso
- **Não existe autenticação nem autorização**. Nenhuma rota é protegida (`routes.tsx` não tem guards).
  Qualquer URL é acessível digitando no navegador, em qualquer app.
- Login do painel: campos com valores default (`parceiro@loopis.com` / `loopis`) e **os inputs nem
  são lidos** — o clique chama `setRole` + `setPartnerType` + `login()` e navega.
- O "tipo de parceiro" é persistido em `localStorage['loopis-mock-partner-type']`
  (`usePartnerContext`) e é **o único mecanismo de "permissão"**: ele decide quais itens de menu
  aparecem (`constants/navigation.ts`) e qual conteúdo cada tela renderiza.
- A identidade do parceiro é **hardcoded** em `usePartnerContext`: `partnerId: 'partner-ost-001'`,
  nome/bairro derivados do tipo (Ostraria do Córrego / Floripa Náutica Tours / Sunset Sessions
  Floripa / Arena Lagoa Beach Tennis).
- No cliente, os "perfis" `restaurant`/`admin` existem no store e no `Header`, mas **não há rotas**
  correspondentes no PWA (ex.: `Header` linka `/restaurante/promocoes`, rota inexistente → 404 mudo).

---

## 3. Loopis-Client (PWA do consumidor)

### 3.1 Inventário de rotas (`src/routes.tsx`, todas dentro de `MainLayout`)
| Rota | Página | Observação |
|---|---|---|
| `/` | `Home` → `GuestLandingPage` | mesma tela logado/deslogado |
| `/auth` | `Auth` | página cheia de login/cadastro |
| `/experiencias` | `ExperiencesPage` | catálogo + filtros + bairros |
| `/experience/:id` e `/experiencias/:id` | `ExperienceDetailView` | jornada por vertical + cross-sell |
| `/parceiro/:id` | `PartnerProfilePage` | perfil da empresa |
| `/restaurante/:id` | `RestaurantDetails` | ficha do restaurante |
| `/notificacoes` | `NotificationsPage` | pedidos de avaliação |
| `/avaliar/:notificationId` | `ReviewExperiencePage` | envio de review |
| `/reserva/checkin` | `CheckIn` | "Minhas Reservas & Compras" |
| `/carteira` | `Wallet` | saldo + extrato |
| `/descontos` e `/descontos/:id/resgate` | → redirect `/carteira` | legado |
| `/cupons` | `Coupons` | cupons mockados fixos |
| `/carteira/ler-cupom` | `ScanReceipt` | OCR de nota fiscal (simulado) |
| `/perfil` | `Profile` | dados + amigos + histórico |
| `/regulamento` | `Rules` | regras de pontuação |
| `/scanner` | `ScannerPage` | leitura de comanda/QR |
| `/order-summary` | `OrderSummaryPage` | resumo da comanda + cupom |
| `/checkout/split` | `CheckoutSplitPage` | pagamento integral ou split |
| `/admin/restaurant/settings` | `RestaurantBillingSettingsPage` | **tela B2B exposta dentro do app do cliente** |

Rotas referenciadas mas **inexistentes**: `/checkout/pay?...` (link enviado ao convidado no split!),
`/restaurante/promocoes` (Header), `/admin/dashboard` (Header quando role=admin).

### 3.2 Jornada do **deslogado**
1. `/` → `GuestLandingPage` (renderizada por `Home`; note que `HomeLoggedIn.tsx` existe mas
   **não é usado por nenhuma rota** — código morto).
2. Header de visitante (`GuestHeader`) com CTAs Entrar / Criar conta.
3. Hero: "Floripa inteira em uma carteira de experiências" + selo "+50 Loops no primeiro cadastro"
   (logado vira "{saldo} Loops para usar hoje").
4. **Filtro por vertical (intenção)**: `all | restaurant | tour | event | rental`
   (chips "Tudo em Floripa / Restaurantes / Tours & Aventuras / Eventos & Festas / Locações")
   + 4 "journey cards" (Jantar hoje / Passeio na água / Noite e eventos / Alugar por hora)
   que setam o mesmo filtro.
5. **Busca textual** livre sobre título, subtítulo, bairro e parceiro.
6. **Feed de descoberta** montado em `useMemo`: 4 restaurantes (`mockGuestRestaurants.slice(0,4)`)
   + 7 experiências (`mockExperiences.slice(0,7)`) + 2 locações hardcoded (Arena Lagoa Beach Tennis,
   Jet-ski Jurerê Express). Primeiro item vira card "Recomendado agora".
7. **Espaços publicitários**: `AdBannerSlot type="hero"` (carrossel automático 6s, 3 banners)
   e `type="interstitial"` (patrocinador — "Heineken & Eisenbahn Gourmet").
8. Blocos de confiança ("Reserve e ganhe", "Divida com amigos", "Use sem atrito").
9. **AuthGate**: `AuthGateModal` (só é aberto pelo header, não pelos cards) → promete
   "+50 LOOPS BÔNUS", "cashback automático de até 25%", "split via Pix". Ambos os botões
   (criar conta / entrar) caem no mesmo `LoginModal`.
10. Deslogado **consegue navegar em tudo** (detalhe de restaurante, experiência, checkout).
    O gate só aparece nos CTAs de reserva/compra (`RestaurantDetails.handleBookingClick`,
    `ExperienceBookingModal.handleProcessPayment`).

### 3.3 Autenticação / onboarding
- Dois pontos de entrada com **regras diferentes**:
  - `LoginModal` (global, montado no `App`): abas Entrar/Criar Conta; cadastro pede nome, e-mail,
    WhatsApp, senha; botão "Continuar com Google" **loga direto sem formulário**.
  - `/auth` (`Auth.tsx`): social login Google/Facebook/Apple (todos chamam `handleAuth` e logam),
    cadastro pede nome, e-mail, senha, WhatsApp, **CPF e data de nascimento**.
- Em ambos, cadastro credita **+50 Loops** (`type: 'bonus'`, "Bônus: Cadastro completo de conta").
- Não há validação de e-mail/CPF, senha, OTP, nem `statusCadastro` sendo realmente usado
  (o tipo `User.statusCadastro: 'simplificado' | 'completo'` só é usado no admin, com dados mock).

### 3.4 Jornada do **logado**
- Bottom nav (mobile): Início `/`, Experiências `/experiencias`, Reservas `/reserva/checkin`, Loops `/carteira`.
- `Header` (desktop): Explorar, Experiências, Minhas Reservas, Meus Loops, saldo, sino de
  notificações (`NotificationsMenu`), acesso a Amigos, dropdown de perfil/sair.
- **Chatbot "Loopi"** (`LoopiChatbot`) só renderiza para `isLoggedIn && currentRole === 'client'`.
  Motor 100% determinístico por `includes` de palavras normalizadas (`services/loopiKnowledge.ts`,
  759 linhas): intents = restaurante específico → cardápio; categorias (frutos do mar, italiano,
  hambúrguer, bar, japonês); bairros (Santo Antônio, Centro/Beira-Mar, Lagoa/Barra); saldo de Loops;
  como escanear cupom; experiências/passeios; "como funciona"; saudação; fallback.
  Cada resposta traz sugestões + CTA de navegação (`/restaurante/:id`, `/carteira`, `/scanner`, `/experiencias`).

### 3.5 Fluxos de compra/conversão **por tipo de parceiro** (peculiaridades)
A tipagem canônica está em `types/experience.ts`: cada vertical tem uma `primaryAction`.

| Vertical | `primaryAction` | Componente | Campos/regras específicas |
|---|---|---|---|
| **Restaurante** | `RESERVATION` | `ReserveTableModal` | data, horário (lista fixa 19:00–21:00), nº de pessoas entre `minGuests`/`maxGuests`; **não cobra nada agora** — "Loops poderão ser usados depois do check-in, quando a comanda for fechada"; jornada: reservar → check-in → lançar comanda → pagar |
| **Tour** | `SLOT_BOOKING` | `BookTourModal` | dia + horário de saída (`departureTimes`), nº de vagas, responsável, documento/telefone dos passageiros; `maxCapacityPerSlot`, `meetingPointLabel`, duração 240 min |
| **Locação** | `SLOT_BOOKING` | `BookTourModal` (modo `isRental`) | horários 08/10/14/18, "unidades" em vez de vagas, **duração da locação (1–3h)**, participantes autorizados, `minimumRentalHours`, `availableUnits`, `requiresSecurityDeposit: true` (caução) |
| **Evento** | `TICKET_PURCHASE` | `SelectTicketsSheet` | lotes (`ticketLots`: 2º Lote / Setor VIP) com preço e `availableQuantity`, quantidade por lote, `gateOpensAt`, `ageRating`, ingressos nominais; total = Σ(preço × qtd) |

- A classificação da vertical é **inferida** em `getPartnerTypeFromListing` a partir de
  `macroCategory`/`type` do mock (Eventos/Shows → EVENT; Tours/Roteiros → TOUR;
  `type === 'Aventura & Mar'` → RENTAL; senão RESTAURANT) e depois "enriquecida" por
  `toExperienceDetail` com **dados sintéticos hardcoded** (ex.: todo evento vira
  `startsAt 2026-08-29T20:00`, `gateOpensAt 19:00`, `ageRating '16'`, lotes fixos).
- Existe **um segundo fluxo de compra paralelo**: `ExperienceBookingModal` (usado no catálogo
  `/experiencias` e nos cards), com data/hora/participantes, escolha Pix ou Cartão (até 12x),
  toggle de Loops, resumo e voucher com QR — **ignorando completamente a tipagem por vertical**.
  Ou seja: comprar pela **lista** e comprar pelo **detalhe** são jornadas diferentes.
- Vouchers: `ExperienceBookingModal` gera `VOUCHER-XXXXXX`; `BookTourModal` gera
  `LOOP-TOUR-#####` / `LOOP-LOC-#####`; `SelectTicketsSheet` gera `LOOP-EVT-#####`.
  Nenhum é persistido no store (só estado local do componente) — **não aparecem em `/reserva/checkin`**.

### 3.6 Cross-sell (o achado mais relevante do PWA)
Local único: `components/experience/LinkedCrossSellingSection.tsx`, renderizado **apenas** em
`ExperienceDetailView` quando a experiência possui `linkedRestaurants` e/ou `linkedRentals`.

Regras implementadas:
- **Ponto de ativação**: dados no mock (`mockExperiences[].linkedRestaurants/linkedRentals`).
  Hoje só 3 das 10 experiências têm vínculos: `tour-churrasco-chao` (2 restaurantes + 2 locações),
  `event-sunset-churrasco` (2 + 2), `exp-2` Costa da Lagoa (1 + 2).
- **Restaurante: seleção única** (clicar em outro troca; clicar no selecionado remove).
  **Locações: seleção múltipla** (toggle).
- **Modo de agendamento por item** (`scheduleMode`):
  - `fixed` → horário definido pelo roteiro (`fixedDateTime`, ex.: "Sábado • 13:00 às 15:00");
  - `client_choice` → cliente escolhe entre `availableTimes` (restaurante) / `availableSlots` (locação);
    o primeiro horário é pré-selecionado automaticamente ao marcar o item.
- **Preço do pacote**: `experience.priceFrom + restaurante.pricePerPerson + Σ(locações.price)`.
  ⚠️ **Não multiplica por número de participantes** (o restaurante é "por pessoa" no rótulo).
- **Loops do pacote**: `round(totalPacote × experience.cashbackPercent / 100)` — usa o % da
  experiência principal e **ignora o `cashbackPercent` próprio de cada item vinculado**
  (que existe no dado e é exibido no card).
- **Vouchers**: `1 + (restaurante ? 1 : 0) + qtdLocações`, com badge "N Vouchers no Combo" e
  copy "vouchers individuais e com QR Code para cada item reservado".
- ⚠️ **Gap funcional**: a seleção de cross-sell **não é passada** para nenhum dos modais de compra
  (`ReserveTableModal` / `BookTourModal` / `SelectTicketsSheet` recebem só `experience`).
  O combo é precificado e exibido, mas **nunca é comprado nem gera os vouchers prometidos**.
- Outros pontos de cross-sell/upsell no app (mais fracos): `AdBannerSlot` (hero/intersticial
  patrocinado), `NeighborhoodExplorer` ("O que fazer no bairro" — parceiros + experiências por
  bairro), `ExperienceStickyActionBar` (para restaurante oferece "Escanear Conta / Split" como
  ação secundária → `/checkout/split?tab=split`).

### 3.7 Comanda, cupom fiscal e pagamento
Três portas de entrada para a mesma jornada:
1. `/scanner` → `CameraViewfinder` (câmera **simulada**, sem `getUserMedia`; botões de lanterna
   e troca de câmera são decorativos) ou `ManualCodeModal` → `mockApi.fetchOrderReceipt(code)`.
2. `/carteira/ler-cupom` (`ScanReceipt`) → "foto"/"galeria" → animação "OCR SEFAZ" → resultado fixo.
3. `ReceiptScannerModal` (aberto em `CheckIn` para reserva de restaurante em andamento).

`mockApi.fetchOrderReceipt` — regras de erro implementadas:
- `CMD-PAGA`/`PAGA` → `ORDER_ALREADY_PAID`; `CMD-CANCELADA`/`CANCELADA` → `ORDER_CANCELLED`;
- `CUPOM-EXP`/`EXPIRADO` → `COUPON_EXPIRED`; códigos conhecidos (`LOOP-8821`, `CMD-4091`, `TIM-1092`);
- regex `^(LOOP|CMD)-\d{4}$` → gera comanda dinâmica (sempre Marisqueira Sintra, 15% de desconto);
- demais → `NOT_FOUND`.

`useOrderSummary` (cálculo financeiro da comanda):
```
subtotal
- baseDiscount (order.appliedDiscount.amount — reserva/campanha/cupom da casa)
- couponDiscount (cupom extra: % sobre subtotal ou valor fixo limitado ao subtotal)
+ serviceFee (order.serviceChargeAmount, 10% sugerido)
= netPayable
earnedLoops = round(netPayable × 1.0)   // 1 Loop por R$ 1  ⚠️ ver §6
```
Cupons válidos no mock: `LOOP20` (20%), `PRIMEIRAVEZ` (10%), `CORTESIA30` (R$30 fixo),
`EXPIRADO` (inválido, mensagem "Cupom expirado em 25/12/2025").

`/checkout/split` (`CheckoutSplitPage` + `useSplitPayment`):
- Duas abas: **Pagar Tudo (Integral)** e **Dividir Conta (Split)**.
- **Loops só podem ser usados no pagamento integral** — ao trocar para split o toggle é zerado
  (`changePaymentMode`), e a copy diz "Disponível apenas no pagamento individual".
- Uso de Loops: `1 Loop = R$ 1`; máximo = `min(saldo, floor(total))`; total a pagar = `total − loops`;
  cashback = `round(valor pago em dinheiro)`.
- Split: modo **igual** (2,3,4,5,6,8 — clamp 2..12) ou **customizado** (edição livre por participante);
  mínimo 2 participantes; sobra/diferença é calculada (`unallocatedDifference`, tolerância ±0,05)
  mas **não bloqueia** o fechamento.
- Participantes: `me` (organizador), `app_user` (vinculado via `UserSearchModal` → `mockApi.searchUsers`)
  ou `guest`. Para cada um: **QR Code Pix** (payload EMV montado por string, não validado),
  **link de pagamento** (`/checkout/pay?...` → rota inexistente) e **compartilhamento por WhatsApp**
  (`api.whatsapp.com/send?text=...`, também em `utils/generateWhatsAppSplitLink.ts`).
- "Simular Pagamento" marca a fração como paga; **só credita Loops na carteira quando quem paga é o
  organizador** (`isCurrentMe`); para `app_user`/`guest` apenas exibe toast "creditados no perfil de @x".
- Quando 100% pago: confete + modal "Conta 100% Liquidada".
- Métodos exibidos: Pix (QR + copia e cola), Cartão de Crédito ("até 3x sem juros" aqui;
  "até 12x" no `ExperienceBookingModal`), Carteira Digital (Apple/Google Pay).

### 3.8 Carteira, regulamento, cupons
- `Wallet`: saldo inicial **850 Loops** (mock), extrato com tipos `earn | redeem | bonus`,
  card fixo "A cada R$ 1,00 consumido você ganha 1 Loop", atalho para ler cupom fiscal.
- `redeemReward` existe no store (troca por `Reward` com `cost`), mas **não há tela de resgate**
  (rotas `/descontos*` redirecionam para a carteira). `mockRewards` = Sobremesa Grátis (150),
  R$50 de desconto (500).
- `Rules` (`/regulamento`): Cadastro completo **+50**, Fazer reserva **+10**, Check-in/consumo
  **1 Loop por R$ 1**, Indicar amigo **+100**.

### 3.9 Minhas Reservas & Compras (`CheckIn`)
- Fonte: `clientBookings` (8 registros mock cobrindo as 4 verticais).
- Filtros: Próximas (`confirmed`) / Em andamento (`checked_in`) / Histórico (`completed`) / Todas.
- Ação primária **depende da vertical e do status**:
  - Restaurante `confirmed` → "Fazer check-in" (muda status para `checked_in`);
  - Restaurante `checked_in` → "Abrir comanda" (abre `ReceiptScannerModal`);
  - Demais verticais → "Ver voucher" (modal com QR + código);
  - `completed` → "Avaliar experiência" (`/avaliar/:notificationId`) ou "Ver histórico".
- Modal de detalhes mostra Loops usados/recebidos, total, status de pagamento
  (`paid`, `pay_at_venue`, `awaiting_payment`).

### 3.10 Avaliações (fluxo interno)
`AppNotification (type: 'review_request')` → `/avaliar/:id` → validação (nota 1–5 obrigatória,
comentário ≥ 10 caracteres, 1 review por notificação) → `InternalReview` com `status: 'pending'`
→ "aguardando moderação" → `ApprovedReviewsSection` exibe apenas `status === 'approved'`
na página do parceiro/restaurante. **A moderação (no painel) usa outra base**, ver §5.7.

### 3.11 Amigos (rede social interna)
`FriendsModal` (abas Amigos / Convites / Buscar): busca em `mockApi.searchUsers` (5 usuários fixos),
`sendFriendInvite` (bloqueia duplicidade e amizade existente), aceitar/recusar/remover,
convite por WhatsApp com link `loopis.com.br/amigos/convite?ref=me`.
Propósito declarado: **dividir contas** (integra com o `UserSearchModal` do split).

---

## 4. Loopis (Painel) — módulo do Parceiro (adaptativo por vertical)

### 4.1 Navegação dinâmica (`constants/navigation.ts`)
**Comum a todos os parceiros**: Visão Geral (`/admin/dashboard`), Configurações da Conta
(`/configuracoes`), Clientes (`/clientes`), Avaliações (`/avaliacoes`).

| Vertical | Itens exclusivos |
|---|---|
| Restaurante | Gestão de Mesas & Reservas (`/mesas-reservas`) |
| Tour | Meus Tours & Aventuras (`/agenda-saidas`), Manifesto de Passageiros (`/manifesto`), Validador de Portaria (`/portaria`), Guias e Embarcações (`/guias-equipamentos`) |
| Evento | Meus Eventos & Festas (`/lotes-ingressos`), Validador de Portaria (`/portaria`), Promoters & Comissões (`/promoters`) |
| Locação | Locações & Quadras (`/grade-horaria`), Validador de Portaria (`/portaria`), Manutenção/Clima (`/bloqueios`) |

Rotas legadas redirecionadas: `/cardapio` → `/configuracoes`; `/loops` → dashboard; `*` → placeholder.

### 4.2 Visão Geral (`PartnerOverview`)
KPIs: GMV via Loopis, "vendas" (label muda por vertical: Reservas confirmadas / Vagas vendidas /
Ingressos emitidos / Slots reservados), Loops gerados, Ticket médio — **todos hardcoded por vertical**.
Gráfico de barras semanal fixo; agenda derivada de `b2bReservations`; contadores
Confirmadas/Check-ins/Concluídas reais do store.

### 4.3 Restaurante — Kanban de Reservas & Comandas (`RestaurantKanbanView`, 807 linhas)
- Colunas: **Solicitações (`pending`) → Confirmadas → Check-in feito → Conta/Pagamento (`completed`)**.
- Filtro de período: Hoje / Amanhã / Próximos 7 dias / Todos / Personalizado (data início/fim).
- **Lançar comanda** em dois modos: **QR/NFC-e** (leitura simulada, 1,2 s) ou **foto da nota**
  (upload real via `FileReader` → base64, leitura simulada 1,4 s). Gera `ComandaRecord` com
  itens, subtotal, **taxa de serviço 10%**, `descontoLoops: 0`, `origemEmissao: 'restaurante'`.
- **Geração de cobrança**: total ou split em N partes (`splitAmountInCents` distribui o resto em
  centavos), com **atribuição de cada parte a um usuário Loopis** (lista mock de 4 usuários +
  o titular da reserva). Cada parte gera payload Pix e link `app.loopis.com.br/pagar/:comandaId/:ref`.
  `loopsToEarn = floor(valor)` **apenas se a parte tiver usuário vinculado**.
- "Marcar como pago" → `processBilling(reservationId, total)` → status `completed` + credita
  `floor(total)` Loops **na carteira do cliente simulado do próprio store**.

### 4.4 Tour
- `TourScheduleView`: CRUD de tours (nome, descrição, ponto de encontro, horários de saída (texto),
  máx. de pessoas, preço, status ativo/pausado, imagem por upload, **vínculo com recursos**
  guias/embarcações/equipamentos).
- `TourGuidesFleetView`: CRUD de recursos — `kind: guia | embarcacao | equipamento`,
  capacidade, documento (CADASTUR/inscrição/lote), status `ativo | manutencao | indisponivel`, foto.
- `TourPassengerManifestView`: seleção da saída, busca por nome/telefone/documento, status do
  passageiro (`confirmado | presente | pendente | cancelado`), contato de emergência, ocupação
  (lugares ocupados/capacidade), presentes, exportar lista (botão sem ação).

### 4.5 Evento
- `EventTicketTierView`: CRUD de evento com setor, lote, preço, quantidade, vendidos,
  itens inclusos (lista dinâmica) e **política de cancelamento** por evento; capa por upload.
- `EventGateValidatorView` (também usado por Tour e Locação, com textos adaptados):
  validação por QR simulado ou **código manual**; regras:
  - código inexistente → erro "Ingresso não encontrado";
  - `cancelado` → bloqueio;
  - `validado` → alerta "Entrada já validada" **e marca como `duplicado`**;
  - `valido` → marca `validado` com horário e libera.
  Contadores: validados, válidos, bloqueados (cancelados + duplicados).
- `EventPromotersCommissionView`: CRUD de promoters (nome, telefone, Instagram, **cupom próprio**
  com % de desconto, **% de comissão**, status), geração automática de cupom a partir do nome,
  clamp 0–100% em desconto e comissão, e painel de vendas por promoter
  (ingressos, GMV bruto, comissão = GMV × %).

### 4.6 Locação
- `RentalAssetsView`: CRUD de ativos (quadra, jet-ski…), **preço/hora**, **mínimo de horas**,
  grade de horários (texto "08:00-22:00"), status `disponivel | manutencao | bloqueado`, foto.
- `RentalMaintenanceView`: bloqueios operacionais por ativo com motivo
  (`manutencao | clima | evento_privado | outro`), data, hora início/fim,
  status (`agendado | ativo | resolvido`) e observação. Filtro por data.

### 4.7 Telas comuns do parceiro
- `PartnerClientsView`: histórico de clientes por vertical (restaurante agrupa por telefone;
  demais verticais usam listas sintéticas), com status de participação
  (`confirmado | compareceu | pago | pendente`), total gasto, Loops gerados, visitas e
  **drill-down nas comandas** (itens, taxa de serviço 10%, desconto em Loops, forma de pagamento).
- `PartnerAccountSettings`: dados comerciais (nome fantasia, telefone, endereço, descrição),
  **logo e galeria** (upload base64), horários por dia da semana, **chave Pix de repasse**,
  taxa de serviço (default 10% só para restaurante), capacidade padrão (varia por vertical:
  evento 450, tour 12, locação 4, restaurante 18), política de cancelamento, regra comercial
  (texto pré-definido por vertical) e, **apenas para restaurante**, o CRUD de cardápio.
  ⚠️ O "Salvar" apenas exibe feedback; nada é persistido (exceto itens de cardápio, que vão ao store).
- `PartnerReviewsModerationView`: fila de avaliações filtrada por `partnerType`, com ações
  Publicar / Ocultar / Rejeitar e contadores. **Base local própria** (9 reviews mock), sem ligação
  com `internalReviews` do store nem com o app do cliente.

---

## 5. Loopis (Painel) — módulo Restaurante legado (`/restaurante/*`)

Coexiste com o painel adaptativo e é acessado pelo fluxo de **cadastro** do login.
Menu: Dashboard, Reservas, Atividades & Histórico, Lançar Comanda, Campanhas, Configurações
(+ rotas `/onboarding`, `/ler-cupom`, `/comercial` fora do menu).

- **`Onboarding` (766 linhas)**: wizard de 3 passos — (1) escolha do tipo de parceiro
  (Restaurante/Gastronomia, Tour & Roteiro, Evento & Festival, Locação); (2) dados gerais +
  campos **específicos por tipo** (restaurante: cardápio com upload de foto; experiência: inclusos,
  duração, preço/pessoa, capacidade; tour: ponto de encontro, roteiro, duração, preço; evento:
  data, horário, local, preço do ingresso, atrações; show: artista, data, horário, couvert);
  (3) conclusão. Banner comercial: **"Sem taxa de setup para os 100 primeiros parceiros"** +
  botão que copia link de **autocadastro** (`loopis.com.br/autocadastro/parceiro-indica`).
- **`ManualEntry` (551 linhas)** — "Emissor de Comanda & Cobrança (Caixa/Garçom)":
  3 abas (cardápio / valor avulso / foto da nota com OCR simulado que preenche R$ 272,00),
  **taxa de serviço fixa de 10%**, `loopsEstimados = floor(total)`, geração de `ComandaRecord` +
  **QR Code real** (`qrcode.react`) apontando para
  `loopis.com.br/checkout/split?comanda=...&total=...`, e confirmação de pagamento
  (pix | cartao | split) que gera um `PartnerActivityRecord` com `statusPresenca: 'compareceu'`.
- **`ActivityLog` (466 linhas)**: histórico de atividades com filtros de data
  (hoje/ontem/semana/custom/todos — **datas fixas 2026-08-18 / 2026-08-17**), presença
  (compareceu/no-show), tipo de parceiro e busca por nome/telefone/código/mesa; métricas do período
  (clientes, comparecimentos, no-shows, faturamento, Loops) e modal com a comanda detalhada.
- **`Reservations`**: kanban simplificado (pending → confirmed → checked_in → completed) com
  `BillingModal` para lançar consumo. ⚠️ O botão de **recusar** (`XCircle`) em "pending"
  chama `updateB2bReservationStatus(res.id, 'completed')` — provável **bug** (deveria ser `cancelled`).
- **`Campaigns`**: criação de campanha com tipo (`porcentagem | valor_fixo | cashback_dobro`),
  valor, **dias da semana** e janela de horário, imagem opcional → `regraHorario` como string
  ("Válido Terça, Quarta das 18:00 às 22:00").
- **`Settings`**: mídia (fotos, vídeo, redes sociais, Google Maps) + CRUD do cardápio.
- **`ScanReceiptRes`**: leitura de cupom fiscal pela casa (IA simulada, valor fixo R$ 185,50,
  copy menciona leitura de **CPF do cliente**).
- **`/restaurante/comercial`** → mesma tela de configurações comerciais do admin (§6.3).

---

## 6. Loopis (Painel) — módulo Admin Loopis (`/admin/*`)

Menu (`AdminLayout`, dark mode forçado): Dashboard (`/dashboard-admin`), Aprovações, Restaurantes,
Clientes, Cobranças, Pontuação (Loops), Auditoria (IA), Configurações.
⚠️ `/admin` (index) redireciona para `/admin/dashboard`, que é **o painel do parceiro**, não o do admin.

- **`Dashboard`**: KPIs da rede (Parceiros Ativos 186, GMV R$ 485K, Pedidos e Reservas 12.450),
  mix por vertical (Restaurantes 42%, Tours 23%, Eventos 19%, Locações 16%), volume mensal
  e série anual — **tudo estático**.
- **`Approvals`**: fila de `PartnerRequest` (`pending`), com ícone por `partnerType`, drawer de
  detalhe (categoria, endereço, telefone, resumo, cardápio/fotos quando houver) e ações
  **Aprovar** (`approvePartnerRequest` → cria um `Restaurante` com `status: 'aprovado'`,
  rating 5.0, promoção "Novo Parceiro! Ganhe Loops", horário "A definir") / **Rejeitar**.
- **`Restaurants`**: tabela de parceiros com filtros por **tipo** (restaurante/tour/evento/rental)
  e **status** (aprovado/pendente/bloqueado — "bloqueado" **não existe no tipo** `Restaurante.status`),
  ações editar/bloquear/excluir (sem efeito real).
- **`Clients`**: base de usuários (3 mocks locais), filtro por `statusCadastro`, saldo de Loops,
  ações editar/bloquear (sem efeito).
- **`Billing`**: fechamento mensal por parceiro — GMV, comissão (10% nos dados), status
  `pending | generated | paid`, detalhe da fatura e `window.print()`.
- **`ScoreConfig`**: Cadastro Completo 50, Reserva Realizada 10, Check-in Efetuado 20,
  Indicação 100 — **estado local, não persiste no store**.
- **`AuditReceipts`**: auditoria da leitura por IA dos cupons — valor lido, origem
  (`cliente | restaurante`), status (`pendente | aprovado | reprovado | ajustado`),
  ações aprovar/reprovar/ajustar (`handleAction` **não implementa nada**).
- **`Settings`** (Configurações Globais / "motor de regras"): comissão base Loopis (%),
  cashback padrão (%), **teto de desconto máximo (%)** ("evita dumping"), cidade ativa
  e toggle de cidade — grava em `systemConfig` do store.
- **`/admin/restaurant/settings`** (`RestaurantBillingSettingsPage` + `useRestaurantBilling`):
  mensalidade SaaS (on/off + valor), **comissão %**, aceite de créditos Loop + **taxa de conversão**,
  dia de vencimento da fatura, dados bancários/Pix e **simulador comercial**:
  ```
  comissão      = GMV × commissionPercent/100
  mensalidade   = hasMonthlyFee ? monthlyFeeAmount : 0
  repasse       = max(0, GMV − comissão − mensalidade)
  loops cliente = acceptsLoopCredits ? round(GMV × loopConversionRate × 0.10) : 0
  ```
  Validações: mensalidade ≥ 0; comissão 0–100%; conversão > 0; vencimento 1–31.
  Defaults do mock: Marisqueira Sintra (mensalidade R$ 249,90, comissão 12,5%, vencimento 10),
  Boteco ORI (sem mensalidade, comissão 15%, vencimento 15), fallback (comissão 12%).

---

## 7. Inconsistências, contradições e código morto (para decidir o que vira requisito)

### 7.1 Regra de cashback — **três regras conflitantes**
| Onde | Regra |
|---|---|
| `useOrderSummary`, `useSplitPayment`, `processBilling`, `ManualEntry` | **1 Loop por R$ 1 pago (100%)** |
| `ExperienceBookingModal`, `BookTourModal`, `SelectTicketsSheet`, cards | `valor × cashbackPercent` (10–25%) |
| `systemConfig.defaultCashbackPercent` (admin) | **1%** |
| `mockApi.calculateCommercialProjection` | 10% fixo |
| Landing (`CalculatorSection`) | 10% ("pool médio de cashback") |

### 7.2 Tabela de pontuação — **três versões**
| Ação | `Rules` (PWA) | `ScoreConfig` (admin) | `tabelaPontuacao` (store) |
|---|---|---|---|
| Cadastro completo | 50 | 50 | 100 |
| Reserva | 10 | 10 | 50 |
| Check-in | 1 por R$ 1 | 20 | 20 |
| Indicação | 100 | 100 | 200 |
(No código, só o bônus de **+50 no cadastro** é efetivamente creditado.)

### 7.3 Links/rotas quebrados
- `/checkout/pay?ref=...` — **link enviado ao convidado no split não existe** (crítico para o fluxo guest).
- `/restaurante/promocoes`, `/admin/dashboard` (via Header do PWA) — inexistentes no PWA.
- `/admin` → cai no painel do parceiro, não no painel do admin.
- Landing: `href="#cadastro"` (âncora inexistente) e "Já sou parceiro" abre o **cadastro**, não login.

### 7.4 Código morto / não roteado
- `Loopis-Client`: `HomeLoggedIn.tsx`, `components/guest/RestaurantGrid.tsx` (441 linhas),
  `components/guest/RestaurantCard.tsx`, `components/checkout/SplitPaymentDrawer.tsx`, `BillingModal.tsx`.
- `Loopis`: `components/onboarding/PartnerWizard.tsx` (410 linhas, **único uso de react-hook-form + zod,
  com schema discriminado por vertical e rascunho em localStorage**) e seus 5 steps;
  `ProfileSelector.tsx`, `BottomNav.tsx`, `CheckIn.tsx`, `HomeLoggedOut.tsx`, `BookingModal.tsx`,
  `GuestLandingPage`/`guest/*` (páginas do consumidor dentro do painel).
- `redeemReward` no store sem tela; `updateComandaStatus` sem uso.

### 7.5 Duplicação divergente entre apps
- `useSplitPayment`: o do PWA aceita `initialTab` e uso de Loops; o do painel não.
- `mockApi`/`guestData`: o painel tem versão reduzida (sem experiências, bairros, macro-categorias).
- `types/index.ts`: só o PWA tem `InternalReview`, `AppNotification`, `ClientBooking`, `Friend*`;
  só o painel tem `MenuItem`/`ComandaRecord`/`PartnerActivityRecord` no store.
- Mesma chave `zustand` (`loopis-storage`) nos dois apps → colisão se publicados no mesmo domínio.

### 7.6 Dados/limitações de negócio embutidos
- Cidade única: **Florianópolis - SC** (`systemConfig.activeCity`, `FlorianopolisAddress` com
  `city: 'Florianopolis'` e `state: 'SC'` **literais no tipo**).
- 7 bairros curados (`mockNeighborhoods`), 8 restaurantes guest, 10 experiências, 5 usuários.
- Datas "de hoje" fixas em 2026-08-18/20 em vários pontos (ActivityLog, Kanban, manifesto).

### 7.7 Segurança/privacidade (observações)
- Sem autenticação real, sem RBAC, sem sessão; `localStorage` como fonte de verdade do papel.
- CPF, telefone, documento e contato de emergência trafegam em estado local sem qualquer proteção;
  a landing cita LGPD, mas o formulário não tem consentimento explícito nem destino.
- Payloads Pix são **strings montadas manualmente** (sem CRC16 válido) — apenas ilustrativos.

---

## 8. Landing Page (`Loopis-landing-page`)

- SPA de página única (sem router): `Header`, `Hero`, `HowItWorks`, `CalculatorSection`,
  `FeaturesSection`, `FaqSection`, `Footer`, `RegisterModal`.
- **Posicionamento exclusivamente B2B-restaurante** (título da aba: "Loopis para Restaurantes |
  Cadastre seu Estabelecimento") — **não menciona tours, eventos e locações**, divergindo do produto.
- Proposta de valor: sem mensalidade/adesão, comissão só sobre venda gerada, IA lê o cupom
  (sem integração com PDV), +35% de recorrência, dashboard em tempo real, campanhas em horários
  ociosos, marketing segmentado, selo de parceiro recomendado, aprovação em até 24h úteis.
- **Calculadora de retorno** (`CalculatorSection`): 3 sliders — ticket médio (R$20–300, default 85),
  clientes/mês (100–3000, default 450), aumento de recorrência (10–50%, default 25%). Cálculo:
  ```
  faturamentoAtual = ticket × clientes
  clientesExtras   = round(clientes × aumento%)
  faturamentoExtra = clientesExtras × ticket
  cashbackGerado   = round(faturamentoExtra × 0,10)
  ```
- **Único ponto de conversão**: `RegisterModal` (nome do estabelecimento, categoria [7 opções,
  com typos "Hambuergueria", "Cafeteira", "Barbecues"], responsável, e-mail, WhatsApp,
  cidade/estado, porte [até 10 / 10–30 / +30 mesas / delivery]). **`handleSubmit` apenas troca
  para a tela de sucesso — nenhum dado é enviado a lugar nenhum** (sem API, CRM, e-mail ou webhook).
- Contato: `comercial@loopis.app` (texto). Redes sociais com `href="#"`.
- Rodapé: "Loopis Tecnologias para Gastronomia Ltda", selo LGPD.
- **Não há qualquer link para o PWA ou para o painel** (nem login de parceiro).

---

## 9. Modelo de dados implícito (entidades encontradas)

`ProfileRole`, `PartnerType`, `User`, `Friend`, `FriendInvite`, `UserSearchResult`,
`Restaurante`, `MenuItem`, `GuestRestaurant`, `Category`, `PartnerMacroCategory`,
`NeighborhoodInfo`, `AdBanner`, `Experience`/`ExperienceDetail` (+ variantes Restaurant/Tour/Event/Rental),
`LinkedRestaurantOption`, `LinkedRentalOption`, `ExperienciaDetalhes`, `TourDetalhes`,
`EventoDetalhes`, `ShowDetalhes`, `Reservation`, `ClientBooking`, `ComandaRecord`, `ComandaItem`,
`Order`, `OrderItem`, `Coupon`, `SplitPaymentSession`, `SplitParticipant`, `Transaction`, `Reward`,
`Campanha`, `CupomFiscal`, `TabelaPontuacao`, `PartnerRequest`, `SystemConfig`,
`RestaurantBillingSettings`, `CommercialSimulationResult`, `PartnerActivityRecord`,
`AppNotification`, `InternalReview`, `BasePartnerOnboarding` + payloads por vertical,
`FlorianopolisAddress`, `BankTransferData`, e entidades locais de tela (TourItem, TourResource,
Departure/Passenger, EventItem, GateTicket, Promoter/PromoterSale, RentalAsset, MaintenanceBlock,
ModerationReview, SplitUser, PixCharge).

---

## 10. Dúvidas a validar antes de escrever o PRD

1. **Natureza do PRD**: documentar o produto **como está** (as-is, protótipo navegável) ou escrever
   como especificação do produto **a construir** (to-be), usando o código como fonte de requisitos?
2. **Seção de gaps**: incluir capítulo de inconsistências/bugs/código morto (§7) no PRD, ou manter
   o PRD "limpo" e deixar isso em anexo separado?
3. **Regra de cashback**: qual é a oficial — 1 Loop por R$ 1 (100%) ou % por parceiro (10–25%)?
   Enquanto não houver decisão, documento as duas como "conflito em aberto".
4. **Tabela de pontuação**: qual das três versões vale (Rules / ScoreConfig / store)?
5. **Cross-sell**: o combo (experiência + restaurante + locações) deve **realmente** ser comprado em
   pagamento único com N vouchers (como a copy promete) — documento isso como requisito, mesmo
   não estando implementado?
6. **Landing**: documento o posicionamento atual (só restaurantes) ou trato como requisito a
   extensão para as 4 verticais? E o formulário deve ter destino definido (CRM/e-mail/API)?
7. **Dois painéis de parceiro** (`/admin/dashboard/*` adaptativo × `/restaurante/*` legado):
   o legado é para descontinuar? Documento os dois ou só o adaptativo?
8. **Dados mock** (restaurantes, experiências, bairros, cardápios): entram como **anexo/catálogo**
   no PRD ou apenas como exemplos ilustrativos?
9. **Profundidade**: incluir referências de arquivo/linha (`Loopis-Client/src/...:123`) em cada
   requisito? (recomendo sim, para rastreabilidade)
10. **Formato**: um único `PRD.md` na raiz (confirmado) — devo commitar/pushar na branch
    `claude/reverse-engineering-prd-d2e6t2`?
