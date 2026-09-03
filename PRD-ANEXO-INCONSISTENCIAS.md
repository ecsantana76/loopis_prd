# Anexo Técnico — Inconsistências, Bugs e Código Morto

> Anexo ao [`PRD.md`](./PRD.md). Mantido **fora** do corpo do PRD por decisão do Cliente.
> Contém apenas achados objetivos de código, com referência `arquivo:linha`.
> Severidade: 🔴 crítico (bloqueia fluxo/negócio) · 🟠 relevante · 🟡 menor/cosmético.

| Versão | Data | Base |
|---|---|---|
| 1.0 | 2026-09-03 | Leitura integral de `Loopis/`, `Loopis-Client/` e `Loopis-landing-page/` |

---

## 1. Conflitos de regra de negócio

### 1.1 🔴 Cashback com três lógicas simultâneas

| Contexto | Regra aplicada | Referência |
|---|---|---|
| Comanda — resumo | `round(netPayable × 1.0)` → **100%** | `Loopis-Client/src/hooks/useOrderSummary.ts:97` |
| Checkout integral | `round(valor pago)` → 100% | `Loopis-Client/src/hooks/useSplitPayment.ts:229` |
| Fração do split | `round(valor da fração)` → 100% | `Loopis-Client/src/hooks/useSplitPayment.ts:179` |
| Encerramento pelo parceiro | `floor(total)` → 100% | `Loopis-Client/src/store/useStore.ts:613` |
| Experiência / tour / locação / ingresso | `valor × cashbackPercent/100` → **10–25%** | `components/experiences/ExperienceBookingModal.tsx:53`; `components/experience/BookTourModal.tsx:39`; `components/experience/SelectTicketsSheet.tsx:29` |
| Config. global do admin | `defaultCashbackPercent = 1` → **1%** | `Loopis/src/store/useStore.ts:510` |
| Simulador comercial | 10% fixo | `Loopis-Client/src/services/mockApi.ts:545` |
| Calculadora da landing | 10% do faturamento extra | `Loopis-landing-page/src/components/CalculatorSection.tsx:13` |

**Efeito**: a mesma plataforma promete de 1% a 100% de retorno conforme a tela.
Ver pendência #1 no PRD.

### 1.2 🔴 Tabela de pontuação com três versões

| Ação | Regulamento (PWA) | ScoreConfig (admin) | `tabelaPontuacao` (store) | Efetivamente creditado |
|---|---|---|---|---|
| Cadastro completo | 50 | 50 | 100 | **50** |
| Reserva | 10 | 10 | 50 | — |
| Check-in | 1 por R$ 1 | 20 | 20 | — |
| Indicação | 100 | 100 | 200 | — |

Referências: `Loopis-Client/src/pages/Rules.tsx:8-35`; `Loopis/src/pages/admin/ScoreConfig.tsx:8-11`;
`Loopis-Client/src/store/useStore.ts:623-628`. Apenas o bônus de cadastro é creditado
(`components/LoginModal.tsx:26-40`; `pages/Auth.tsx:25-38`).

### 1.3 🟠 Parcelamento do cartão divergente

"Até 12x no cartão" no modal de experiência
(`components/experiences/ExperienceBookingModal.tsx:281`) × "Até 3x sem juros" no checkout
(`pages/CheckoutSplitPage.tsx:224`).

### 1.4 🟠 Cashback do cross-sell ignora o percentual de cada item

`ExperienceDetailView.tsx:216` calcula `round(totalPacote × experiencia.cashbackPercent / 100)`,
enquanto cada `LinkedRestaurantOption`/`LinkedRentalOption` possui `cashbackPercent` próprio
(exibido no card, ex.: 15%, 20%, 25%). Restaurantes com % maior que o da experiência entregam menos
Loops que o anunciado no próprio card.

### 1.5 🟠 Preço do pacote não multiplica por participante

`ExperienceDetailView.tsx:213-215` soma `pricePerPerson` do restaurante uma única vez, embora o
rótulo exibido seja "/ pessoa" (`LinkedCrossSellingSection.tsx:206`). O mesmo vale para as locações
cobradas "por pessoa" (ex.: Kit Snorkel).

### 1.6 🟡 Status "bloqueado" inexistente no modelo

O filtro de parceiros do admin oferece "Bloqueados" (`Loopis/src/pages/admin/Restaurants.tsx:66`),
mas `Restaurante.status` só admite `'pendente' | 'aprovado'` (`types/index.ts`).

---

## 2. Fluxos incompletos

### 2.1 🔴 Cross-sell não é comprado

A seleção (`selectedRestaurant`, `selectedRentals`, `selectedRestaurantTime`, `selectedRentalSlots`)
vive apenas em `ExperienceDetailView` (`:204-207`) e **não é passada** para
`ReserveTableModal`, `BookTourModal` ou `SelectTicketsSheet` (`:460-469`), que recebem somente
`experience`. Consequências: o pagamento cobre apenas a atividade principal; os "N vouchers"
prometidos (`LinkedCrossSellingSection.tsx:56-58`) nunca são emitidos.

### 2.2 🔴 Página de pagamento do convidado não existe

`useSplitPayment.ts:54`, `:100` e `:139` geram `{origin}/checkout/pay?ref=...&p=...&amt=...`,
enviado por WhatsApp e "Copiar Link" — a rota **não está registrada** em
`Loopis-Client/src/routes.tsx`. O convidado recebe um link que abre uma página em branco.

### 2.3 🟠 Vouchers gerados não são persistidos

`ExperienceBookingModal.tsx:65`, `BookTourModal.tsx:76` e `SelectTicketsSheet.tsx:40` guardam o
código do voucher em `useState` local. Nada é gravado em `clientBookings`, portanto os vouchers
**não aparecem** em `/reserva/checkin`.

### 2.4 🟠 Ações de back-office sem efeito

| Tela | Ação | Referência |
|---|---|---|
| Auditoria IA | Aprovar / Reprovar / Ajustar apenas fecham o modal | `Loopis/src/pages/admin/AuditReceipts.tsx:32-35` |
| Parceiros (admin) | Editar / Bloquear / Excluir sem handler | `Loopis/src/pages/admin/Restaurants.tsx` |
| Clientes (admin) | Editar / Bloquear sem handler | `Loopis/src/pages/admin/Clients.tsx` |
| Config. da conta (parceiro) | "Salvar" só exibe toast; nada persiste (exceto cardápio) | `Loopis/src/pages/partner/PartnerAccountSettings.tsx:50-54` |
| Tabela de pontuação | Salva em `useState`, não no store | `Loopis/src/pages/admin/ScoreConfig.tsx:17-21` |
| Manifesto de passageiros | "Exportar lista" sem handler | `Loopis/src/pages/partner/TourPassengerManifestView.tsx` |
| Landing | Formulário de parceria não envia dados | `Loopis-landing-page/src/components/RegisterModal.tsx:25-28` |

### 2.5 🟠 Resgate de recompensas sem interface

`redeemReward` está implementado com validação de saldo (`store/useStore.ts:833-851`) e há
catálogo de `rewards`, mas as rotas `/descontos` e `/descontos/:id/resgate` **redirecionam** para
`/carteira` (`routes.tsx:43-44`). Não há tela de resgate.

### 2.6 🟡 Câmera é decorativa

`CameraViewfinder` não usa `navigator.mediaDevices.getUserMedia`; os botões de lanterna e de troca
de câmera alteram apenas o estado visual, e o upload de arquivo sempre devolve o código fixo
`LOOP-8821` (`components/scanner/CameraViewfinder.tsx:20-31`).

---

## 3. Rotas e navegação

| # | Sev. | Problema | Referência |
|---|---|---|---|
| 3.1 | 🔴 | `/checkout/pay` referenciado e inexistente (§2.2) | `useSplitPayment.ts:54` |
| 3.2 | 🟠 | `/admin` (index) redireciona para `/admin/dashboard`, que resolve para o **painel do parceiro**, não o do admin (que fica em `/admin/dashboard-admin`) | `Loopis/src/routes.tsx:112-113` |
| 3.3 | 🟠 | Header do PWA aponta para `/restaurante/promocoes` e `/admin/dashboard`, inexistentes nesse app | `Loopis-Client/src/components/Header.tsx:73`, `:78` |
| 3.4 | 🟠 | Tela B2B `RestaurantBillingSettingsPage` exposta dentro do PWA do consumidor em `/admin/restaurant/settings` | `Loopis-Client/src/routes.tsx:58` |
| 3.5 | 🟡 | CTA "Quero Alcançar Este Resultado" aponta para `#cadastro`, âncora inexistente | `Loopis-landing-page/src/components/CalculatorSection.tsx:144` |
| 3.6 | 🟡 | "Já sou parceiro" abre o modal de **cadastro**, não um login | `Loopis-landing-page/src/components/Header.tsx:36` |
| 3.7 | 🟡 | Redes sociais do rodapé com `href="#"` | `Loopis-landing-page/src/components/Footer.tsx:39-47` |
| 3.8 | 🟡 | `ExperienceDetailView` faz fallback para `mockExperiences[0]` quando o `id` não existe, em vez de exibir "não encontrado" | `ExperienceDetailView.tsx:208` |

---

## 4. Bugs de comportamento

### 4.1 🔴 Recusar reserva marca como concluída

No kanban legado, o botão de recusa (ícone `XCircle`) na coluna "Novas Solicitações" chama
`updateB2bReservationStatus(res.id, 'completed')` — deveria ser `'cancelled'`.
Efeito: reservas recusadas entram na coluna "Concluídas" e contam como faturamento.
`Loopis/src/pages/restaurant/Reservations.tsx:55`.

### 4.2 🟠 Split desbalanceado pode ser fechado

`useSplitPayment.ts:296-301` calcula `unallocatedDifference` e `isBalanced` (tolerância ±R$ 0,05),
mas nenhum ponto do fluxo usa esses valores para bloquear o pagamento. Em modo customizado é
possível liquidar a conta com soma diferente do total.

### 4.3 🟠 Loops de convidados são anunciados mas não creditados

`useSplitPayment.ts:171-207`: só o organizador (`isCurrentMe`) tem `loopsBalance` alterado.
Para `app_user` e `guest` o app exibe "+N Loops creditados no perfil de @x" sem qualquer efeito.

### 4.4 🟠 Chave única de `persist` compartilhada entre os dois apps

Ambos usam `name: 'loopis-storage'` (`Loopis/src/store/useStore.ts` e
`Loopis-Client/src/store/useStore.ts:1010`). Publicados no mesmo domínio, painel e PWA
sobrescrevem o estado um do outro (inclusive `isLoggedIn`, `currentRole` e `loopsBalance`).

### 4.5 🟠 Datas de referência fixas

O histórico do parceiro considera "hoje" como `2026-08-18` e "ontem" como `2026-08-17`
(`Loopis/src/pages/restaurant/ActivityLog.tsx:31-39`); o kanban compara com a data real do
navegador (`RestaurantKanbanView.tsx:105-108`), de modo que o filtro "Hoje" tende a vir vazio.

### 4.6 🟠 Reserva auto-confirmada sem intervenção do parceiro

`createReservation` agenda `updateReservationStatus('confirmed')` em 2 s
(`Loopis-Client/src/store/useStore.ts:812-817`), curto-circuitando o aceite do restaurante.

### 4.7 🟡 Moderação de avaliações desconectada do app do cliente

`PartnerReviewsModerationView` opera sobre uma lista mock local (`initialReviews:19-29`), sem
ligação com `internalReviews` do store. Avaliações enviadas pelo cliente nunca chegam à fila do
parceiro, e a aprovação no painel não publica nada no PWA.

### 4.8 🟡 Payloads Pix não são válidos

Strings EMV montadas por concatenação, sem CRC16 nem estrutura conforme BR Code
(`useSplitPayment.ts:55`; `RestaurantKanbanView.tsx:95-96`). Servem apenas para renderizar um QR.

### 4.9 🟡 Validação de cupom ignora o restaurante

`validateCoupon(couponCode, _restaurantId)` recebe o parceiro mas não o utiliza
(`services/mockApi.ts:367`), embora `Coupon` tenha `restaurantId` e `minOrderValue`
(este último nunca verificado).

---

## 5. Código morto / não roteado

### 5.1 `Loopis-Client`

| Arquivo | Linhas | Observação |
|---|---|---|
| `pages/HomeLoggedIn.tsx` | 209 | Home alternativa com carrossel promocional e filtro por categoria — nenhuma rota a usa (a rota `/` renderiza `GuestLandingPage`) |
| `components/guest/RestaurantGrid.tsx` | 441 | Grade completa de descoberta com filtros — sem referências |
| `components/guest/RestaurantCard.tsx` | 99 | Usado apenas pelo `RestaurantGrid` |
| `components/checkout/SplitPaymentDrawer.tsx` | 201 | Drawer alternativo de split — sem referências |
| `components/BillingModal.tsx` | 141 | Modal B2B de lançamento de consumo — sem referências no PWA |

### 5.2 `Loopis`

| Arquivo | Linhas | Observação |
|---|---|---|
| `components/onboarding/PartnerWizard.tsx` | 410 | Onboarding de 5 passos com `zod` discriminado por vertical, rascunho em `localStorage` e campos comerciais (Pix, comissão, regra de repasse). **Único uso de react-hook-form + zod no monorepo** — não roteado |
| `components/onboarding/{CategorySelector,RestaurantStep,TourStep,EventStep,RentalStep}.tsx` | 67+24+24+28+20 | Steps do wizard acima |
| `components/ProfileSelector.tsx` | 91 | Alternador de visão (Visitante / Cliente / Restaurante / Admin) — não montado |
| `pages/CheckIn.tsx`, `pages/HomeLoggedOut.tsx`, `pages/GuestLandingPage.tsx` e `components/guest/*` | ~600 | Telas do consumidor dentro do painel, sem rotas |
| `components/BottomNav.tsx`, `components/BookingModal.tsx` | 50 + 185 | Sem referências |

### 5.3 Store

`updateComandaStatus` (`Loopis/src/store/useStore.ts:646`) e `redeemReward`
(`Loopis-Client/src/store/useStore.ts:833`) estão implementados e sem consumidores.

---

## 6. Duplicação divergente entre aplicações

Arquivos copiados entre `Loopis` e `Loopis-Client` que **já divergiram**:

| Arquivo | Divergência |
|---|---|
| `hooks/useSplitPayment.ts` | O do PWA aceita `initialTab` e uso de Loops (`handlePayFullDirect(loopsUsed)`); o do painel não tem nenhum dos dois |
| `pages/CheckoutSplitPage.tsx` | Só o PWA tem o bloco de uso de Loops |
| `services/mockApi.ts` | Mesma API, com documentação e comentários apenas no PWA |
| `mocks/guestData.ts` | Painel: 4 exports (198 linhas). PWA: 7 exports com experiências, bairros e macro-categorias (758 linhas) |
| `types/index.ts` | Só o PWA tem `InternalReview`, `AppNotification`, `ClientBooking`, `Friend`, `FriendInvite`; só o painel usa `MenuItem`, `ComandaRecord`, `PartnerActivityRecord` no store |
| `store/useStore.ts` | Interfaces `AppState` diferentes (ver acima); dados mock diferentes (12 reservas B2B no painel × 3 no PWA) |

Risco: correções aplicadas em um app não se propagam ao outro.

---

## 7. Segurança, privacidade e conformidade

| # | Sev. | Achado |
|---|---|---|
| 7.1 | 🔴 | **Sem autenticação**: `login()` apenas seta um booleano; no painel os campos de e-mail/senha têm valores default e não são lidos (`Loopis/src/pages/Login.tsx:57-77`) |
| 7.2 | 🔴 | **Sem autorização**: nenhuma rota é protegida; qualquer URL (inclusive `/admin/*`) abre por digitação direta |
| 7.3 | 🟠 | O papel do usuário vive em `localStorage` (`loopis-mock-partner-type`), editável pelo próprio usuário |
| 7.4 | 🟠 | Dados pessoais sensíveis (CPF, data de nascimento, documento de passageiro, contato de emergência) são coletados sem consentimento explícito, política de retenção ou mascaramento — `pages/Auth.tsx:186-201`; `components/experience/BookTourModal.tsx:140-146` |
| 7.5 | 🟠 | A landing exibe selo "Ambiente Seguro & Dados Protegidos (LGPD)" enquanto o formulário não tem checkbox de consentimento nem destino definido |
| 7.6 | 🟡 | Uploads de imagem são convertidos em base64 e mantidos em memória/`localStorage` (risco de estouro de cota) |
| 7.7 | 🟡 | Módulo do caixa menciona leitura automática do **CPF do cliente** a partir do cupom (`Loopis/src/pages/restaurant/ScanReceiptRes.tsx`), sem base legal declarada |

---

## 8. Qualidade e consistência de conteúdo

| # | Achado | Referência |
|---|---|---|
| 8.1 | Erros de digitação nas categorias da landing: "Hambuergueria", "Cafeteira / Doceria", "Brasileira / Barbecues" | `Loopis-landing-page/src/components/RegisterModal.tsx:124-130` |
| 8.2 | Landing só comunica restaurantes, embora o produto atenda 4 verticais | `Loopis-landing-page/index.html:7` |
| 8.3 | Duas jornadas de compra distintas para a mesma experiência (catálogo × detalhe), com campos e regras diferentes | `ExperienceBookingModal.tsx` × `ExperienceDetailView.tsx` |
| 8.4 | Dois onboardings de parceiro conceitualmente diferentes (3 passos roteado × 5 passos não roteado) | `pages/restaurant/Onboarding.tsx` × `components/onboarding/PartnerWizard.tsx` |
| 8.5 | Dois painéis de parceiro com funções sobrepostas (`/admin/dashboard/*` × `/restaurante/*`) | `Loopis/src/routes.tsx:67`, `:91` |
| 8.6 | Tipos `ShowDetalhes` e o passo "Show" no onboarding legado não correspondem a nenhuma vertical de `PartnerType` | `types/index.ts`; `pages/restaurant/Onboarding.tsx` |
| 8.7 | Dados sintéticos hardcoded na conversão de experiência (todo evento vira 29/08/2026, portaria 19:00, classificação 16 anos) | `ExperienceDetailView.tsx:102-116` |
| 8.8 | Cardápio da ficha do restaurante é escolhido por categoria com listas fixas, ignorando `restaurant.cardapio` | `pages/RestaurantDetails.tsx:178-260` |

---

## 9. Infraestrutura e engenharia

| # | Achado |
|---|---|
| 9.1 | Não há workspace de monorepo (sem `package.json` raiz, pnpm/turbo/nx); cada app tem seu próprio lockfile |
| 9.2 | Não existe pacote compartilhado para tipos, store, serviços e componentes duplicados (§6) |
| 9.3 | Não há testes automatizados, CI, Dockerfile ou script de deploy |
| 9.4 | Não há variáveis de ambiente nem camada de configuração — URLs e regras estão hardcoded |
| 9.5 | `README.md` das três pastas é o template padrão do Vite, sem documentação do produto |
| 9.6 | `Loopis-Client` não é instalável como PWA (sem `manifest.json`, service worker ou ícones) |
| 9.7 | Histórico Git com 2 commits ("Initial commit of monorepo projects", "Add project contents to monorepo") — sem rastro de evolução |
