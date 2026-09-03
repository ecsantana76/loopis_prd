import React from 'react';
import { Utensils, Waves, Calendar, Clock, Check, Sparkles, Tag, Plus } from 'lucide-react';
import type { LinkedRestaurantOption, LinkedRentalOption } from '../../types';

interface LinkedCrossSellingSectionProps {
  linkedRestaurants?: LinkedRestaurantOption[];
  linkedRentals?: LinkedRentalOption[];
  selectedRestaurantId?: string | null;
  selectedRentalIds: string[];
  selectedRestaurantTime?: string;
  selectedRentalSlots: Record<string, string>;
  onSelectRestaurant: (restaurant: LinkedRestaurantOption, time?: string) => void;
  onDeselectRestaurant: () => void;
  onToggleRental: (rental: LinkedRentalOption, slot?: string) => void;
  onRestaurantTimeChange: (time: string) => void;
  onRentalSlotChange: (rentalId: string, slot: string) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export const LinkedCrossSellingSection: React.FC<LinkedCrossSellingSectionProps> = ({
  linkedRestaurants = [],
  linkedRentals = [],
  selectedRestaurantId,
  selectedRentalIds,
  selectedRestaurantTime,
  selectedRentalSlots,
  onSelectRestaurant,
  onDeselectRestaurant,
  onToggleRental,
  onRestaurantTimeChange,
  onRentalSlotChange,
}) => {
  const hasRestaurants = linkedRestaurants.length > 0;
  const hasRentals = linkedRentals.length > 0;

  if (!hasRestaurants && !hasRentals) return null;

  return (
    <div className="space-y-6">
      {/* Informação sobre emissão de múltiplos vouchers */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-violet/10 via-purple-500/10 to-brand-coral/10 p-5 border border-brand-violet/20">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-brand-graphite dark:text-white flex items-center gap-2">
              <span>Monte seu Pacote com Restaurante e Locações</span>
              <span className="bg-brand-violet text-white text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full">
                Múltiplos Vouchers
              </span>
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Adicione refeições e equipamentos ao seu pedido. Ao concluir o pagamento único, serão gerados <strong>vouchers individuais e com QR Code</strong> para cada item reservado (um para o evento/tour, um para o restaurante e um para a locação).
            </p>
          </div>
        </div>
      </div>

      {/* 1. RESTAURANTES DISPONÍVEIS */}
      {hasRestaurants && (
        <section className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-white/10 dark:bg-white/[0.04] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Utensils size={16} />
              </div>
              <div>
                <h2 className="text-lg font-black text-brand-graphite dark:text-white">
                  Restaurantes Disponíveis no Roteiro
                </h2>
                <p className="text-xs text-gray-500">Escolha uma parada gastronômica para incluir no seu pacote</p>
              </div>
            </div>
            {selectedRestaurantId && (
              <button
                type="button"
                onClick={onDeselectRestaurant}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Remover refeição
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {linkedRestaurants.map((rest) => {
              const isSelected = selectedRestaurantId === rest.id;

              return (
                <div
                  key={rest.id}
                  onClick={() => {
                    if (isSelected) {
                      onDeselectRestaurant();
                    } else {
                      onSelectRestaurant(rest, rest.availableTimes ? rest.availableTimes[0] : undefined);
                    }
                  }}
                  className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10 shadow-md ring-2 ring-brand-violet/30'
                      : 'border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-[#1a1a1f] hover:border-brand-violet/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/10">
                      <img
                        src={rest.imageUrl}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          {rest.category}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-brand-violet text-white shadow-md'
                              : 'bg-white/80 dark:bg-black/80 text-gray-400'
                          }`}
                        >
                          {isSelected ? <Check size={16} /> : <Plus size={16} />}
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="font-extrabold text-sm leading-tight drop-shadow">{rest.name}</p>
                        <p className="text-[10px] text-gray-200">{rest.location}</p>
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-black text-brand-violet dark:text-brand-lilac bg-brand-violet/10 px-2.5 py-1 rounded-lg">
                        <Tag size={12} />
                        <span>{rest.specialBenefit}</span>
                      </div>
                      {rest.description && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {rest.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                    {/* Regra de Agendamento */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Horário da Reserva:</span>
                      {rest.scheduleMode === 'fixed' ? (
                        <span className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
                          <Calendar size={12} className="text-brand-violet" />
                          {rest.fixedDateTime || 'Definido pelo evento'}
                        </span>
                      ) : (
                        <span className="font-bold text-brand-violet flex items-center gap-1">
                          <Clock size={12} />
                          Livre para escolher
                        </span>
                      )}
                    </div>

                    {/* Seletor de Horário se for livre e estiver selecionado */}
                    {isSelected && rest.scheduleMode === 'client_choice' && rest.availableTimes && (
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                          Selecione o horário desejado:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {rest.availableTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestaurantTimeChange(time);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                selectedRestaurantTime === time
                                  ? 'bg-brand-violet text-white shadow-sm'
                                  : 'bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-violet'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preço e Cashback */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Adicional</p>
                        <p className="text-sm font-black text-brand-graphite dark:text-white">
                          +{formatCurrency(rest.pricePerPerson)}
                          <span className="text-[10px] text-gray-500 font-normal"> / pessoa</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        +{rest.cashbackPercent}% Cashback
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. LOCAÇÕES DISPONÍVEIS */}
      {hasRentals && (
        <section className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-white/10 dark:bg-white/[0.04] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Waves size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-graphite dark:text-white">
                Locações & Equipamentos Disponíveis
              </h2>
              <p className="text-xs text-gray-500">Adicione equipamentos e itens de lazer para usar durante a atividade</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {linkedRentals.map((rental) => {
              const isSelected = selectedRentalIds.includes(rental.id);
              const selectedSlot = selectedRentalSlots[rental.id] || (rental.availableSlots ? rental.availableSlots[0] : '');

              return (
                <div
                  key={rental.id}
                  onClick={() => onToggleRental(rental, selectedSlot)}
                  className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20 shadow-md ring-2 ring-cyan-500/30'
                      : 'border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-[#1a1a1f] hover:border-cyan-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-black/10">
                      <img
                        src={rental.imageUrl}
                        alt={rental.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2">
                        <span className="bg-cyan-900/80 backdrop-blur-md text-cyan-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-cyan-500/30">
                          {rental.partnerName}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-cyan-600 text-white shadow-md'
                              : 'bg-white/80 dark:bg-black/80 text-gray-400'
                          }`}
                        >
                          {isSelected ? <Check size={16} /> : <Plus size={16} />}
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="font-extrabold text-sm leading-tight drop-shadow">{rental.title}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {rental.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                    {/* Regra de Agendamento da Locação */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Período de Retirada:</span>
                      {rental.scheduleMode === 'fixed' ? (
                        <span className="font-bold text-gray-800 dark:text-white flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-cyan-500" />
                          {rental.fixedDateTime || 'Conforme roteiro'}
                        </span>
                      ) : (
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 text-[11px]">
                          <Clock size={12} />
                          Escolha o horário
                        </span>
                      )}
                    </div>

                    {/* Seletor de Slot se for livre e estiver selecionado */}
                    {isSelected && rental.scheduleMode === 'client_choice' && rental.availableSlots && (
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                          Horário da Locação:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {rental.availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRentalSlotChange(rental.id, slot);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                selectedSlot === slot
                                  ? 'bg-cyan-600 text-white shadow-sm'
                                  : 'bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-cyan-500'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preço e Cashback */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Adicional</p>
                        <p className="text-sm font-black text-brand-graphite dark:text-white">
                          +{formatCurrency(rental.price)}
                          <span className="text-[10px] text-gray-500 font-normal"> / {rental.unitLabel}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        +{rental.cashbackPercent}% Cashback
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
