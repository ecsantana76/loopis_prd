import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { GuestHeader } from '../components/guest/GuestHeader';
import { BottomNav } from '../components/BottomNav';
import { LoopiChatbot } from '../components/chat/LoopiChatbot';
import { useStore } from '../store/useStore';

export const MainLayout: React.FC = () => {
  const { currentRole, isLoggedIn, openLoginModal } = useStore();
  const location = useLocation();
  const isClient = currentRole === 'client';
  const isAuthPage = location.pathname === '/auth';
  const isHomePage = location.pathname === '/';

  // If user is on HomePage, GuestLandingPage renders full-width with its own top Header/GuestHeader
  if (isHomePage) {
    return (
      <div className={`client-shell min-h-screen w-full overflow-x-hidden bg-brand-off-white transition-colors duration-300 dark:bg-[#121214] ${isClient && isLoggedIn ? 'pb-20 md:pb-0' : ''}`}>
        <main className="client-content w-full min-w-0">
          <Outlet />
        </main>

        {isClient && isLoggedIn && <BottomNav />}
        {isClient && isLoggedIn && <LoopiChatbot />}
      </div>
    );
  }

  return (
    <div className={`client-shell min-h-screen overflow-x-hidden bg-brand-off-white transition-colors duration-300 dark:bg-brand-graphite ${isClient && !isAuthPage && isLoggedIn ? 'pb-20 md:pb-0' : ''}`}>
      {!isAuthPage && (
        isLoggedIn ? (
          <Header />
        ) : (
          <GuestHeader onOpenLogin={openLoginModal} onOpenRegister={openLoginModal} />
        )
      )}
      
      <main className={`client-content min-w-0 ${!isAuthPage ? 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8' : 'w-full'}`}>
        <Outlet />
      </main>

      {isClient && !isAuthPage && isLoggedIn && <BottomNav />}
      {isClient && isLoggedIn && <LoopiChatbot />}
    </div>
  );
};

