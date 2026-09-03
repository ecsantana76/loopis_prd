import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, Star, WalletCards } from 'lucide-react';
import { mockExperiences, mockGuestRestaurants } from '../mocks/guestData';
import { ApprovedReviewsSection } from '../components/reviews/ApprovedReviewsSection';

const fallbackImage =
  'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=1200';

export const PartnerProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockGuestRestaurants.find((item) => item.id === id);
  const experiences = mockExperiences.filter((item) => item.partnerId === id);
  const firstExperience = experiences[0];

  const name = restaurant?.name || firstExperience?.partnerName || 'Parceiro Loopis';
  const neighborhood = restaurant?.location || firstExperience?.neighborhood || 'Florianópolis';
  const imageUrl = restaurant?.imageUrl || firstExperience?.imageUrl || fallbackImage;
  const description =
    restaurant?.promotionBadge ||
    firstExperience?.description ||
    'Empresa parceira Loopis com experiências, agenda, pagamentos e benefícios conectados ao app.';

  return (
    <div className="min-h-screen bg-[#f6f6f8] pb-24 text-brand-graphite dark:bg-[#111114] dark:text-white">
      <section className="relative min-h-[420px] overflow-hidden bg-black">
        <img src={imageUrl} alt={name} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-black/45 p-3 text-white backdrop-blur"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-end px-4 pb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-brand-graphite">
              <MapPin size={13} />
              {neighborhood}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-violet px-3 py-1 text-xs font-black text-white">
              <ShieldCheck size={13} />
              Parceiro verificado
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">{name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/82">{description}</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            ['Avaliação', restaurant?.rating ? restaurant.rating.toFixed(1) : '4.9'],
            ['Loops de volta', restaurant ? `até ${restaurant.cashbackPercent}%` : 'até 25%'],
            ['Produtos ativos', String(Math.max(experiences.length, restaurant ? 1 : 0))],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <p className="text-xs font-black uppercase text-gray-400">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Produtos e jornadas</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Escolha uma experiência para reservar, comprar ingresso, agendar saída ou alugar por hora.
              </p>
            </div>
          </div>

          {experiences.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((experience) => (
                <Link
                  key={experience.id}
                  to={`/experience/${experience.id}`}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#1a1a1f] dark:ring-white/10"
                >
                  <div className="relative h-44 bg-black">
                    <img src={experience.imageUrl} alt={experience.title} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-black text-brand-graphite">
                      {experience.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-gray-500">
                      <span className="truncate">{experience.neighborhood}</span>
                      <span className="inline-flex items-center gap-1 text-yellow-700">
                        <Star size={13} className="fill-yellow-500 text-yellow-500" />
                        {experience.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight">{experience.title}</h3>
                    <p className="mt-3 flex items-center gap-1 text-xs font-black text-brand-violet">
                      <WalletCards size={14} />
                      Ganhe até {Math.round((experience.price * experience.cashbackPercent) / 100)} Loops
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Link
              to={`/restaurante/${restaurant?.id || id || ''}`}
              className="mt-4 block rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-[#1a1a1f] dark:ring-white/10"
            >
              <h3 className="text-lg font-black">Abrir jornada do restaurante</h3>
              <p className="mt-2 text-sm text-gray-500">Veja cardápio, agenda, check-in, comanda e pagamento da reserva.</p>
            </Link>
          )}
        </section>

        <ApprovedReviewsSection partnerId={id || ''} />
      </main>
    </div>
  );
};
