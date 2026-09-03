import React from 'react';
import { CalendarClock, Compass, Ticket, Utensils } from 'lucide-react';
import { PartnerType, type PartnerType as PartnerTypeValue } from '../../types';

interface CategorySelectorProps {
  value?: PartnerTypeValue;
  onChange: (type: PartnerTypeValue) => void;
}

const categories = [
  {
    type: PartnerType.RESTAURANT,
    title: 'Restaurante',
    description: 'Gastronomia, bares e beach clubs.',
    icon: Utensils,
  },
  {
    type: PartnerType.TOUR,
    title: 'Tour/Aventura',
    description: 'Passeios de barco, trilhas e experiências guiadas.',
    icon: Compass,
  },
  {
    type: PartnerType.EVENT,
    title: 'Evento/Festa',
    description: 'Shows, festas, baladas e eventos especiais.',
    icon: Ticket,
  },
  {
    type: PartnerType.RENTAL,
    title: 'Locação/Quadras',
    description: 'Quadras, jet-ski, equipamentos e horários.',
    icon: CalendarClock,
  },
] as const;

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {categories.map((category) => {
      const Icon = category.icon;
      const isSelected = value === category.type;

      return (
        <button
          key={category.type}
          type="button"
          onClick={() => onChange(category.type)}
          className={`text-left rounded-2xl border p-5 transition-all cursor-pointer ${
            isSelected
              ? 'border-brand-violet bg-brand-violet/15 shadow-[0_0_24px_rgba(124,58,237,0.18)]'
              : 'border-white/10 bg-white/[0.03] hover:border-brand-violet/50 hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-2xl p-3 ${isSelected ? 'bg-brand-violet text-white' : 'bg-white/10 text-brand-lilac'}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{category.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{category.description}</p>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);
