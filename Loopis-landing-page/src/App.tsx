import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { CalculatorSection } from './components/CalculatorSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FaqSection } from './components/FaqSection';
import { RegisterModal } from './components/RegisterModal';
import { Footer } from './components/Footer';

export function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleCloseRegister = () => setIsRegisterOpen(false);

  return (
    <div className="min-h-screen bg-[#0d0b14] text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Navigation Header */}
      <Header onOpenRegister={handleOpenRegister} />

      {/* Main Sections */}
      <main>
        <Hero onOpenRegister={handleOpenRegister} />
        <HowItWorks />
        <CalculatorSection />
        <FeaturesSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onOpenRegister={handleOpenRegister} />

      {/* Restaurant Registration Modal */}
      <RegisterModal isOpen={isRegisterOpen} onClose={handleCloseRegister} />
    </div>
  );
}

export default App;
