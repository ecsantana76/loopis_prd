import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Client Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { CheckIn } from './pages/CheckIn';
import { Wallet } from './pages/Wallet';
import { Coupons } from './pages/Coupons';
import { ScanReceipt } from './pages/ScanReceipt';
import { Profile } from './pages/Profile';
import { Rules } from './pages/Rules';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ExperienceDetailView } from './pages/ExperienceDetailView';
import { PartnerProfilePage } from './pages/PartnerProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReviewExperiencePage } from './pages/ReviewExperiencePage';

// New Required Modules
import { ScannerPage } from './pages/ScannerPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { CheckoutSplitPage } from './pages/CheckoutSplitPage';
import { RestaurantBillingSettingsPage } from './pages/admin/RestaurantBillingSettingsPage';

export const router = createBrowserRouter([
  // Client Module
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'auth', element: <Auth /> },
      { path: 'experiencias', element: <ExperiencesPage /> },
      { path: 'experience/:id', element: <ExperienceDetailView /> },
      { path: 'experiencias/:id', element: <ExperienceDetailView /> },
      { path: 'parceiro/:id', element: <PartnerProfilePage /> },
      { path: 'restaurante/:id', element: <RestaurantDetails /> },
      { path: 'notificacoes', element: <NotificationsPage /> },
      { path: 'avaliar/:notificationId', element: <ReviewExperiencePage /> },
      { path: 'reserva/checkin', element: <CheckIn /> },
      { path: 'carteira', element: <Wallet /> },
      { path: 'descontos', element: <Navigate to="/carteira" replace /> },
      { path: 'descontos/:id/resgate', element: <Navigate to="/carteira" replace /> },
      { path: 'cupons', element: <Coupons /> },
      { path: 'carteira/ler-cupom', element: <ScanReceipt /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'regulamento', element: <Rules /> },
      
      // 1. Scanner de Cupom & Resumo da Comanda
      { path: 'scanner', element: <ScannerPage /> },
      { path: 'order-summary', element: <OrderSummaryPage /> },
      
      // 2. Checkout & Split Payment
      { path: 'checkout/split', element: <CheckoutSplitPage /> },
      
      // 3. Configurações Comerciais do Restaurante
      { path: 'admin/restaurant/settings', element: <RestaurantBillingSettingsPage /> },
    ],
  }
]);
