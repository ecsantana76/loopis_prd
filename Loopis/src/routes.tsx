import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RestaurantLayout } from './layouts/RestaurantLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Auth Page
import { Login } from './pages/Login';

// Restaurant Pages
import { Dashboard as RestaurantDashboard } from './pages/restaurant/Dashboard';
import { Onboarding } from './pages/restaurant/Onboarding';
import { Reservations } from './pages/restaurant/Reservations';
import { Campaigns } from './pages/restaurant/Campaigns';
import { ManualEntry } from './pages/restaurant/ManualEntry';
import { ScanReceiptRes } from './pages/restaurant/ScanReceiptRes';
import { Settings as RestaurantSettings } from './pages/restaurant/Settings';
import { ActivityLog } from './pages/restaurant/ActivityLog';

// Admin Pages
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Approvals } from './pages/admin/Approvals';
import { Billing } from './pages/admin/Billing';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { Restaurants as AdminRestaurants } from './pages/admin/Restaurants';
import { Clients as AdminClients } from './pages/admin/Clients';
import { ScoreConfig as AdminScoreConfig } from './pages/admin/ScoreConfig';
import { AuditReceipts as AdminAuditReceipts } from './pages/admin/AuditReceipts';

// New Features: Scanner, Order Summary, Checkout Split, and Restaurant Billing Settings
import { ScannerPage } from './pages/ScannerPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { CheckoutSplitPage } from './pages/CheckoutSplitPage';
import { RestaurantBillingSettingsPage } from './pages/admin/RestaurantBillingSettingsPage';
import { PartnerLayout } from './components/dashboard/PartnerLayout';
import { PartnerOverview } from './pages/partner/PartnerOverview';
import { PartnerAccountSettings } from './pages/partner/PartnerAccountSettings';
import { PartnerClientsView } from './pages/partner/PartnerClientsView';
import { RestaurantKanbanView } from './pages/partner/RestaurantKanbanView';
import { TourScheduleView } from './pages/partner/TourScheduleView';
import { TourPassengerManifestView } from './pages/partner/TourPassengerManifestView';
import { TourGuidesFleetView } from './pages/partner/TourGuidesFleetView';
import { EventTicketTierView } from './pages/partner/EventTicketTierView';
import { EventGateValidatorView } from './pages/partner/EventGateValidatorView';
import { EventPromotersCommissionView } from './pages/partner/EventPromotersCommissionView';
import { RentalAssetsView } from './pages/partner/RentalAssetsView';
import { RentalMaintenanceView } from './pages/partner/RentalMaintenanceView';
import { PartnerPlaceholderView } from './pages/partner/PartnerPlaceholderView';
import { PartnerReviewsModerationView } from './pages/partner/PartnerReviewsModerationView';

export const router = createBrowserRouter([
  // Auth Route
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // Standalone Client Flows
  { path: '/scanner', element: <ScannerPage /> },
  { path: '/order-summary', element: <OrderSummaryPage /> },
  { path: '/checkout/split', element: <CheckoutSplitPage /> },

  // Partner Adaptive Dashboard
  {
    path: '/admin/dashboard',
    element: <PartnerLayout />,
    children: [
      { index: true, element: <PartnerOverview /> },
      { path: 'configuracoes', element: <PartnerAccountSettings /> },
      { path: 'clientes', element: <PartnerClientsView /> },
      { path: 'avaliacoes', element: <PartnerReviewsModerationView /> },
      { path: 'cardapio', element: <Navigate to="/admin/dashboard/configuracoes" replace /> },
      { path: 'loops', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'mesas-reservas', element: <RestaurantKanbanView /> },
      { path: 'agenda-saidas', element: <TourScheduleView /> },
      { path: 'manifesto', element: <TourPassengerManifestView /> },
      { path: 'guias-equipamentos', element: <TourGuidesFleetView /> },
      { path: 'lotes-ingressos', element: <EventTicketTierView /> },
      { path: 'portaria', element: <EventGateValidatorView /> },
      { path: 'promoters', element: <EventPromotersCommissionView /> },
      { path: 'grade-horaria', element: <RentalAssetsView /> },
      { path: 'bloqueios', element: <RentalMaintenanceView /> },
      { path: '*', element: <PartnerPlaceholderView /> },
    ],
  },
  
  // Restaurant Module
  {
    path: '/restaurante',
    element: <RestaurantLayout />,
    children: [
      { index: true, element: <Navigate to="/restaurante/dashboard" replace /> },
      { path: 'dashboard', element: <RestaurantDashboard /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'reservas', element: <Reservations /> },
      { path: 'atividades', element: <ActivityLog /> },
      { path: 'campanhas', element: <Campaigns /> },
      { path: 'lancamento', element: <ManualEntry /> },
      { path: 'ler-cupom', element: <ScanReceiptRes /> },
      { path: 'configuracoes', element: <RestaurantSettings /> },
      { path: 'comercial', element: <RestaurantBillingSettingsPage /> },
    ],
  },
  
  // Admin Module
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard-admin', element: <AdminDashboard /> },
      { path: 'aprovacoes', element: <Approvals /> },
      { path: 'restaurantes', element: <AdminRestaurants /> },
      { path: 'clientes', element: <AdminClients /> },
      { path: 'cobrancas', element: <Billing /> },
      { path: 'pontuacao', element: <AdminScoreConfig /> },
      { path: 'auditoria', element: <AdminAuditReceipts /> },
      { path: 'configuracoes', element: <AdminSettings /> },
      { path: 'restaurant/settings', element: <RestaurantBillingSettingsPage /> },
      { path: 'restaurant-settings', element: <RestaurantBillingSettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
