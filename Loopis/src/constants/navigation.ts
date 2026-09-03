import { PartnerType, type PartnerType as PartnerTypeValue } from '../types';

export type PartnerNavIcon =
  | 'barChart'
  | 'wallet'
  | 'settings'
  | 'calendar'
  | 'bookOpen'
  | 'scan'
  | 'ship'
  | 'users'
  | 'ticket'
  | 'badgePercent'
  | 'grid'
  | 'cloudSun'
  | 'star';

export interface PartnerNavigationItem {
  to: string;
  label: string;
  description: string;
  icon: PartnerNavIcon;
}

export const commonPartnerNavigation: PartnerNavigationItem[] = [
  {
    to: '/admin/dashboard',
    label: 'Visão Geral',
    description: 'Métricas de GMV, vendas e conversão',
    icon: 'barChart',
  },
  {
    to: '/admin/dashboard/configuracoes',
    label: 'Configurações da Conta',
    description: 'Dados comerciais, repasses e operação',
    icon: 'settings',
  },
  {
    to: '/admin/dashboard/clientes',
    label: 'Clientes',
    description: 'Histórico de participações e consumo',
    icon: 'users',
  },
  {
    to: '/admin/dashboard/avaliacoes',
    label: 'Avaliações',
    description: 'Moderação e publicação de comentários',
    icon: 'star',
  },
];

export const partnerNavigationByType: Record<PartnerTypeValue, PartnerNavigationItem[]> = {
  [PartnerType.RESTAURANT]: [
    {
      to: '/admin/dashboard/mesas-reservas',
      label: 'Gestão de Mesas & Reservas',
      description: 'Kanban operacional de reservas',
      icon: 'calendar',
    },
  ],
  [PartnerType.TOUR]: [
    {
      to: '/admin/dashboard/agenda-saidas',
      label: 'Meus Tours & Aventuras',
      description: 'Cadastro, agenda e preços',
      icon: 'calendar',
    },
    {
      to: '/admin/dashboard/manifesto',
      label: 'Manifesto de Passageiros',
      description: 'Lista de presença por saída',
      icon: 'users',
    },
    {
      to: '/admin/dashboard/portaria',
      label: 'Validador de Portaria',
      description: 'Leitura de vouchers e check-in',
      icon: 'scan',
    },
    {
      to: '/admin/dashboard/guias-equipamentos',
      label: 'Guias e Embarcações',
      description: 'Equipe, barcos e equipamentos',
      icon: 'ship',
    },
  ],
  [PartnerType.EVENT]: [
    {
      to: '/admin/dashboard/lotes-ingressos',
      label: 'Meus Eventos & Festas',
      description: 'Eventos, setores, lotes e estoque',
      icon: 'ticket',
    },
    {
      to: '/admin/dashboard/portaria',
      label: 'Validador de Portaria',
      description: 'Scanner web para entrada',
      icon: 'scan',
    },
    {
      to: '/admin/dashboard/promoters',
      label: 'Promoters & Comissões',
      description: 'Vendas por promoter',
      icon: 'badgePercent',
    },
  ],
  [PartnerType.RENTAL]: [
    {
      to: '/admin/dashboard/grade-horaria',
      label: 'Locações & Quadras',
      description: 'Ativos, slots, preços e reservas',
      icon: 'grid',
    },
    {
      to: '/admin/dashboard/portaria',
      label: 'Validador de Portaria',
      description: 'Leitura de vouchers e retirada',
      icon: 'scan',
    },
    {
      to: '/admin/dashboard/bloqueios',
      label: 'Manutenção / Clima',
      description: 'Bloqueios operacionais',
      icon: 'cloudSun',
    },
  ],
};

export const getPartnerNavigation = (partnerType: PartnerTypeValue): PartnerNavigationItem[] => [
  ...commonPartnerNavigation,
  ...partnerNavigationByType[partnerType],
];
