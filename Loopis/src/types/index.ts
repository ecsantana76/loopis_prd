export type ProfileRole = 'client' | 'restaurant' | 'admin';

export { PartnerType } from './partner';
import type { PartnerType } from './partner';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  statusCadastro: 'simplificado' | 'completo';
  origemLogin: 'email' | 'google' | 'facebook' | 'apple';
  loopsSaldo: number;
  historicoAcessos: string[];
}

export interface MenuItem {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl: string;
  categoria?: string;
}

export interface ExperienciaDetalhes {
  oQueInclui: string[];
  duracao: string;
  precoPorPessoa: number;
  regras: string;
  vagasMax: number;
  diasDisponiveis: string[];
}

export interface TourDetalhes {
  pontoEncontro: string;
  roteiro: string[];
  duracao: string;
  horariosSaida: string[];
  preco: number;
  idiomaGuia?: string;
}

export interface EventoDetalhes {
  dataEvento: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  atracoes: string[];
  lotes: { id: string; nome: string; preco: number; qtdDisponivel: number }[];
}

export interface ShowDetalhes {
  artistaBanda: string;
  dataShow: string;
  horario: string;
  couvertPreco: number;
  tipoAssento: string;
  generoMusical: string;
}

export interface Restaurante {
  id: string;
  nome: string;
  tipoParceiro?: PartnerType;
  endereco: string;
  categoria: string;
  status: 'pendente' | 'aprovado';
  horarioFuncionamento: string;
  fotosMenu: string[];
  fotosGaleria: string[];
  cardapio?: MenuItem[];
  experienciaDetalhes?: ExperienciaDetalhes;
  tourDetalhes?: TourDetalhes;
  eventoDetalhes?: EventoDetalhes;
  showDetalhes?: ShowDetalhes;
  videoUrl?: string;
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    googleMaps?: string;
  };
  avaliacoesGoogle: unknown[];
  
  rating?: number;
  distance?: string;
  promotion?: string;
  imageUrl?: string;
  location?: string;
}

export type TransactionType = 'earn' | 'redeem' | 'bonus';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  description: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  restaurantId?: string;
  restaurantName?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'no_show' | 'cancelled';

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  partnerType?: PartnerType;
  date: string;
  time: string;
  guests: number;
  promotionSelected: boolean;
  status: ReservationStatus;
  clientName?: string;
  clientPhone?: string;
  checkInTimestamp?: string;
}

export interface ComandaItem {
  id: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  imagemUrl?: string;
  observacoes?: string;
}

export interface ComandaRecord {
  id: string;
  comandaCode: string;
  clienteNome: string;
  clienteTelefone?: string;
  clienteCpf?: string;
  mesaOuReferencia?: string;
  data: string;
  horario: string;
  itens: ComandaItem[];
  subtotal: number;
  taxaServico: number;
  descontoLoops: number;
  total: number;
  status: 'aberta' | 'aguardando_pagamento' | 'paga' | 'cancelada';
  formaPagamento?: 'pix' | 'cartao' | 'split' | 'loops' | 'dinheiro';
  fotoCupomUrl?: string;
  qrCodeData?: string;
  origemEmissao: 'restaurante' | 'cliente';
}

export interface PartnerActivityRecord {
  id: string;
  partnerId: string;
  partnerNome: string;
  tipoParceiro: PartnerType;
  data: string;
  horario: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteCpf?: string;
  reservaId?: string;
  statusPresenca: 'compareceu' | 'no_show' | 'em_andamento' | 'cancelada';
  horarioCheckin?: string;
  pessoasQtd: number;
  comanda?: ComandaRecord;
  totalGasto: number;
  loopsGerados: number;
  beneficioUtilizado?: string;
}

export interface Campanha {
  id: string;
  restauranteId: string;
  tipo: 'porcentagem' | 'valor_fixo' | 'cashback_dobro';
  valor: number;
  regraHorario: string;
  status: 'ativa' | 'inativa' | 'agendada';
  imagemUrl?: string;
}

export interface CupomFiscal {
  id: string;
  consumoId: string;
  fotoUrl: string;
  valorLidoIa: number;
  lidoPor: 'cliente' | 'restaurante';
  statusValidacao: 'pendente' | 'aprovado' | 'divergente' | 'duplicado';
  clienteNome?: string;
  dataEmissao?: string;
}

export interface TabelaPontuacao {
  id: string;
  acao: 'cadastro_completo' | 'reserva' | 'checkin' | 'indicacao';
  valorEmLoops: number;
}

export interface PartnerRequest {
  id: string;
  name: string;
  partnerType?: PartnerType;
  category: string;
  address: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  detailsSummary?: string;
  cardapio?: MenuItem[];
  fotosGaleria?: string[];
}

export interface SystemConfig {
  defaultCashbackPercent: number;
  maxDiscountAllowed: number;
  loopisCommissionPercent: number;
  activeCity: string;
  isCityActive: boolean;
}

export * from './billing';
export * from './guest';
export * from './partner';
