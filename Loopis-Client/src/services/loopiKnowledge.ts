import type { Restaurante, Experience } from '../types';

export interface MenuItemInfo {
  id: string;
  nome: string;
  categoria: string;
  preco: string;
  descricao: string;
  imagem?: string;
  popular?: boolean;
}

export interface RestaurantMenuData {
  restaurantId: string;
  nome: string;
  categoria: string;
  bairro: string;
  endereco: string;
  cashback: string;
  rating: number;
  imageUrl: string;
  horario: string;
  especialidade: string;
  itensCardapio: MenuItemInfo[];
}

export const RESTAURANT_MENUS: Record<string, RestaurantMenuData> = {
  'marisqueira-sintra': {
    restaurantId: 'marisqueira-sintra',
    nome: 'Marisqueira Sintra',
    categoria: 'Frutos do Mar',
    bairro: 'Santo Antônio de Lisboa',
    endereco: 'R. XV de Novembro, 147 - Santo Antônio de Lisboa',
    cashback: '20% de Cashback em Loops + Sobremesa Cortesia',
    rating: 4.9,
    imageUrl: '/images/restaurants/marisqueira-sintra.png',
    horario: 'Qua a Seg - 12h às 23h',
    especialidade: 'Frutos do mar açorianos frescos e ostras cultivadas na baía',
    itensCardapio: [
      {
        id: 'm1',
        nome: 'Sequência de Camarão Especial',
        categoria: 'Especialidades',
        preco: 'R$ 148,00',
        descricao: 'Camarão ao alho e óleo, à milanesa, ao bafo e molho de camarão. Acompanha arroz branco e pirão açoriano.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'm2',
        nome: 'Ostras Frescas da Ilha (Dúzia)',
        categoria: 'Entradas',
        preco: 'R$ 68,00',
        descricao: 'Ostras cultivadas em Florianópolis servidas in natura no gelo com limão siciliano ou ao bafo.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'm3',
        nome: 'Bacalhau à Brás Tradicional',
        categoria: 'Pratos Principais',
        preco: 'R$ 92,00',
        descricao: 'Lascados de bacalhau nobre com batata palha artesanal, ovos orgânicos e azeitonas pretas.',
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'm4',
        nome: 'Polvo Grelhado no Azeite de Ervas',
        categoria: 'Pratos Principais',
        preco: 'R$ 115,00',
        descricao: 'Tentáculos de polvo grelhados com batatas ao murro, alho confit e flor de sal.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'm5',
        nome: 'Pastel de Nata Português',
        categoria: 'Sobremesas',
        preco: 'R$ 16,00 (Cortesia com reserva Loopis!)',
        descricao: 'Receita tradicional portuguesa de massa folhada ultra crocante e creme de ovos assado.',
        imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'boteco-ori': {
    restaurantId: 'boteco-ori',
    nome: 'Boteco ORI',
    categoria: 'Bares & Petiscos',
    bairro: 'Córrego Grande',
    endereco: 'R. Lauro Linhares, 1250 - Córrego Grande',
    cashback: 'Chopp em dobro + 15% cashback no Happy Hour (17h-20h)',
    rating: 4.8,
    imageUrl: '/images/restaurants/boteco-ori.png',
    horario: 'Ter a Dom - 17h às 01h',
    especialidade: 'Petiscos de boteco gourmet, chopp artesanal gelado e drinks autorais',
    itensCardapio: [
      {
        id: 'bo1',
        nome: 'Torresmo de Rolo Crocante',
        categoria: 'Petiscos',
        preco: 'R$ 48,00',
        descricao: 'Pancetta suína pururucada servida com geleia artesanal de pimenta dedo-de-moça e limão galego.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'bo2',
        nome: 'Dadinhos de Tapioca com Queijo Canastra',
        categoria: 'Petiscos',
        preco: 'R$ 38,00',
        descricao: 'Cubos crocantes de tapioca com queijo meia cura e melaço de cana picante.',
        imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'bo3',
        nome: 'Bolinho de Costela com Requeijão de Corte (6 un)',
        categoria: 'Petiscos',
        preco: 'R$ 44,00',
        descricao: 'Massa cremosa de costela desfiada assada por 12h, empanada na farinha panko.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'bo4',
        nome: 'Picanha na Chapa com Mandioca na Manteiga',
        categoria: 'Chapas',
        preco: 'R$ 96,00',
        descricao: 'Tiras de picanha nobre acebolada, mandioca cremosa na manteiga de garrafa e farofa crocante.',
        imagem: 'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'bo5',
        nome: 'Chopp Artesanal IPA/Pilsen (500ml)',
        categoria: 'Bebidas & Chopp',
        preco: 'R$ 16,00 (Em dobro até 20h com Loopis)',
        descricao: 'Chopp artesanal catarinense servido em caneco ultracongelado.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'o-timoneiro': {
    restaurantId: 'o-timoneiro',
    nome: 'O Timoneiro',
    categoria: 'Frutos do Mar',
    bairro: 'Barra da Lagoa',
    endereco: 'R. Amaro Coelho, 120 - Barra da Lagoa',
    cashback: 'Sequência de Camarão Completa com 25% de Cashback',
    rating: 4.9,
    imageUrl: '/images/restaurants/o-timoneiro.jpg',
    horario: 'Seg a Dom - 11:30h às 23:30h',
    especialidade: 'Sequência tradicional de frutos do mar à beira do canal da Barra',
    itensCardapio: [
      {
        id: 'ot1',
        nome: 'Sequência de Camarão Tradicional (Para 2 Pessoas)',
        categoria: 'Especialidades',
        preco: 'R$ 189,00',
        descricao: 'Camarão à milanesa, ao alho e óleo, camarão ao vapor e ensopado de camarão cremoso. Acompanha arroz, fritas, pirão e salada.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'ot2',
        nome: 'Moqueca Mista de Garoupa e Camarão',
        categoria: 'Pratos Principais',
        preco: 'R$ 138,00',
        descricao: 'Cozida lentamente na panela de barro com leite de coco, azeite de dendê, pimentões e coentro fresco.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'ot3',
        nome: 'Casquinha de Siri Pura',
        categoria: 'Entradas',
        preco: 'R$ 32,00',
        descricao: 'Carne pura de siri catado temperada à moda do pescador, gratinada com queijo parmesão.',
        imagem: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'ot4',
        nome: 'Isca de Peixe Branco com Molho Tártaro Artesanal',
        categoria: 'Petiscos',
        preco: 'R$ 56,00',
        descricao: 'Filé de peixe fresco empanado crocante servido com molho tártaro da casa.',
        imagem: 'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'trattoria-carbone': {
    restaurantId: 'trattoria-carbone',
    nome: 'Trattoria Carbone',
    categoria: 'Italiano',
    bairro: 'Centro & Beira-Mar',
    endereco: 'Av. Osvaldo Rodrigues Cabral, 1570 - Centro',
    cashback: '20% off em Vinhos Selecionados + 15% Cashback em Loops',
    rating: 4.9,
    imageUrl: '/images/restaurants/trattoria-carbone.png',
    horario: 'Ter a Dom - 19h às 00h',
    especialidade: 'Massas artesanais frescas, salsa de trufas negras e pizzas de fermentação lenta',
    itensCardapio: [
      {
        id: 'tc1',
        nome: 'Tagliatelle ao Tartufata e Filé Mignon',
        categoria: 'Massas Artesanais',
        preco: 'R$ 78,00',
        descricao: 'Massa fresca artesanal com pasta de trufas negras da Umbria, cogumelos salteados e medalhões suculentos de filé mignon.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'tc2',
        nome: 'Pizza Napolitana Margherita D.O.P.',
        categoria: 'Pizzas',
        preco: 'R$ 62,00',
        descricao: 'Fermentação natural de 48h, molho de tomate San Marzano, mozzarella fior di latte e folhas frescas de manjericão.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'tc3',
        nome: 'Carpaccio Clássico com Alcaparras e Grana Padano',
        categoria: 'Entradas',
        preco: 'R$ 44,00',
        descricao: 'Finas lâminas de filé cru temperadas com molho de mostarda Dijon, alcaparras marinadas e lascas generosas de grana padano.',
        imagem: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'tc4',
        nome: 'Tiramisù Tradicional Italiano',
        categoria: 'Sobremesas',
        preco: 'R$ 28,00',
        descricao: 'Biscoitos savoiardi embebidos em espresso italiano e vinho Marsala, entremeados com creme leve de mascarpone e cacau 70%.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'soul-burger-gourmet': {
    restaurantId: 'soul-burger-gourmet',
    nome: 'Soul Burger Artesanal',
    categoria: 'Hambúrguer',
    bairro: 'Centro',
    endereco: 'Av. Rio Branco, 480 - Centro',
    cashback: 'Combo Especial com 15% Cashback em Loops',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    horario: 'Ter a Dom - 18h às 23:30h',
    especialidade: 'Burgers artesanais na brasa, blends nobres e queijo cheddar inglês fundido',
    itensCardapio: [
      {
        id: 'sb1',
        nome: 'Soul Bacon Cheddar Duplo',
        categoria: 'Burgers',
        preco: 'R$ 46,00',
        descricao: 'Dois blends de 120g na brasa, cheddar inglês cremoso derretido, fatias crocantes de bacon caramelizado e maionese defumada.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'sb2',
        nome: 'Smash Trufado com Cogumelos',
        categoria: 'Burgers',
        preco: 'R$ 42,00',
        descricao: 'Smash burger prensado com crostinha crocante, queijo gouda, cogumelos salteados no azeite trufado e brioche selado na manteiga.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'sb3',
        nome: 'Batatas Rústicas com Alecrim e Parmesão',
        categoria: 'Acompanhamentos',
        preco: 'R$ 26,00',
        descricao: 'Batatas com casca crocantes por fora e macias por dentro, salpicadas com alecrim fresco e queijo parmesão ralado na hora.',
        imagem: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'sb4',
        nome: 'Milkshake de Doce de Leite & Flor de Sal',
        categoria: 'Sobremesas & Bebidas',
        preco: 'R$ 24,00',
        descricao: 'Sorvete artesanal batido com doce de leite caseiro cremoso, chantilly e pitadas de flor de sal.',
        imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'rancho-acoriano': {
    restaurantId: 'rancho-acoriano',
    nome: 'Rancho Açoriano Gastronomia',
    categoria: 'Frutos do Mar',
    bairro: 'Ribeirão da Ilha',
    endereco: 'Rod. Baldicero Filomeno, 5600 - Ribeirão da Ilha',
    cashback: '20% de Cashback em Loops + Ostras de Entrada',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
    horario: 'Qua a Dom - 11:30h às 23h',
    especialidade: 'A mais famosa rota das ostras de Floripa, em decks panorâmicos sobre o mar calmo',
    itensCardapio: [
      {
        id: 'ra1',
        nome: 'Ostras Gratinadas com Queijo da Serra (Dúzia)',
        categoria: 'Especialidades',
        preco: 'R$ 76,00',
        descricao: 'Ostras frescas gratinadas com queijo colonial serrano, molho bechamel artesanal e toque de noz moscada.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'ra2',
        nome: 'Moqueca de Garoupa com Camarão Rosa',
        categoria: 'Pratos Principais',
        preco: 'R$ 152,00',
        descricao: 'Postas de garoupa fresca e camarões rosas na panela de barro tradicional.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'ra3',
        nome: 'Arroz de Polvo Açoriano Malandrinho',
        categoria: 'Pratos Principais',
        preco: 'R$ 98,00',
        descricao: 'Arroz caldoso e aveludado com polvo macio cozido no próprio caldo, tomates e ervas da horta.',
        imagem: 'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  'sushi-prime-floripa': {
    restaurantId: 'sushi-prime-floripa',
    nome: 'Nikkei Fusion & Sushi Prime',
    categoria: 'Japonesa & Fusion',
    bairro: 'Centro & Beira-Mar',
    endereco: 'Av. Beira Mar Norte, 2200 - Centro',
    cashback: '20% de Cashback em Loops + Welcome Drink',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    horario: 'Seg a Sáb - 19h às 23:30h',
    especialidade: 'Culinária japonesa contemporânea, cortes nobres de peixe fresco e saquês selecionados',
    itensCardapio: [
      {
        id: 'sp1',
        nome: 'Combinado Black Salmon Trufado (20 Peças)',
        categoria: 'Combinados Especiais',
        preco: 'R$ 110,00',
        descricao: 'Sashimis de salmão maçaricado com azeite trufado, flor de sal, niguiris especiais e uramakis com vieiras.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'sp2',
        nome: 'Tartar de Atum Bluefin com Foie Gras',
        categoria: 'Entradas',
        preco: 'R$ 68,00',
        descricao: 'Atum fresco picado na ponta da faca com azeite de gergelim torrado, raspas de limão siciliano e lâmina de foie gras.',
        imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'sp3',
        nome: 'Menu Degustação Omakase (7 Passos)',
        categoria: 'Experiência Chef Table',
        preco: 'R$ 280,00',
        descricao: 'Experiência sensorial guiada pelo chef com os melhores cortes do dia e harmonização opcional de saquê.',
        popular: true,
        imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
};

export interface LoopiResponse {
  text: string;
  matchedRestaurants?: RestaurantMenuData[];
  matchedExperiences?: Experience[];
  suggestions: string[];
  actionType?: 'view_restaurant' | 'view_wallet' | 'view_scanner' | 'view_experiences' | 'none';
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Normaliza o texto removendo acentos e convertendo para lowercase
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Motor de respostas em linguagem natural do chatbot Loopi
 */
export function generateLoopiResponse(
  userPrompt: string,
  context: {
    loopsBalance: number;
    restaurants: Restaurante[];
    userName?: string;
  }
): LoopiResponse {
  const norm = normalizeText(userPrompt);
  const { loopsBalance } = context;

  // 1. O que tem pra comer em tal lugar? (Busca por restaurante específico)
  for (const [key, menuData] of Object.entries(RESTAURANT_MENUS)) {
    const nameNorm = normalizeText(menuData.nome);
    const keyNorm = normalizeText(key.replace(/-/g, ' '));
    const simpleTokens = nameNorm.split(' ').filter((t) => t.length > 2);

    const mentionsRestaurant =
      norm.includes(nameNorm) ||
      norm.includes(keyNorm) ||
      simpleTokens.some((token) => norm.includes(token) && norm.length > 5);

    if (mentionsRestaurant) {
      const isCardapioQuery =
        norm.includes('comer') ||
        norm.includes('cardapio') ||
        norm.includes('menu') ||
        norm.includes('prato') ||
        norm.includes('pedir') ||
        norm.includes('tem pra comer') ||
        norm.includes('preco') ||
        norm.includes('opcoes') ||
        norm.includes('especialidade');

      const itemsList = menuData.itensCardapio
        .map((item) => `• **${item.nome}** (${item.preco}): ${item.descricao}`)
        .join('\n\n');

      const text = isCardapioQuery
        ? `✨ **No ${menuData.nome} você encontra pratos incríveis!**\n\n${itemsList}\n\n💡 **Destaque:** ${menuData.especialidade}.\n🎉 **Benefício Loopis:** ${menuData.cashback}!`
        : `📍 **${menuData.nome}**\n\n📌 **Bairro:** ${menuData.bairro}\n⏰ **Horário:** ${menuData.horario}\n⭐ **Avaliação:** ${menuData.rating.toFixed(1)} / 5.0\n🎁 **Benefício Loopis:** ${menuData.cashback}\n\n🍽️ **Pratos principais do cardápio:**\n\n${itemsList}`;

      return {
        text,
        matchedRestaurants: [menuData],
        suggestions: [
          `Fazer reserva no ${menuData.nome}`,
          'Ver outros restaurantes com Cashback',
          'Quais experiências têm em Floripa?',
          'Qual meu saldo de Loops?',
        ],
        actionType: 'view_restaurant',
        actionUrl: `/restaurante/${menuData.restaurantId}`,
        actionLabel: `Ver Detalhes do ${menuData.nome}`,
      };
    }
  }

  // 2. Consultas sobre Categoria / Tipo de Comida (Frutos do Mar, Italiano, Hamburguer, Bares, Japonesa)
  if (
    norm.includes('frutos do mar') ||
    norm.includes('peixe') ||
    norm.includes('camarao') ||
    norm.includes('ostra') ||
    norm.includes('bacalhau') ||
    norm.includes('polvo')
  ) {
    const seaRestaurants = [
      RESTAURANT_MENUS['marisqueira-sintra'],
      RESTAURANT_MENUS['o-timoneiro'],
      RESTAURANT_MENUS['rancho-acoriano'],
    ].filter(Boolean);

    return {
      text: `🌊 **Os melhores Frutos do Mar de Florianópolis com Cashback Loopis:**\n\n1. **Marisqueira Sintra** (Santo Antônio de Lisboa) — Ostras frescas premiadas, Sequência de Camarão e bacalhau açoriano com 20% de Cashback + sobremesa cortesia.\n2. **O Timoneiro** (Barra da Lagoa) — Famosa Sequência de Camarão completa e moquecas à beira do canal com 25% de Cashback!\n3. **Rancho Açoriano** (Ribeirão da Ilha) — Ostras gratinadas e arroz de polvo nos decks sobre o mar.\n\nQual desses você gostaria de conhecer?`,
      matchedRestaurants: seaRestaurants,
      suggestions: [
        'O que tem pra comer na Marisqueira Sintra?',
        'O que tem pra comer no Timoneiro?',
        'O que comer no Rancho Açoriano?',
        'Ver passeios de barco em Floripa',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/marisqueira-sintra',
      actionLabel: 'Ver Marisqueira Sintra',
    };
  }

  if (
    norm.includes('italiano') ||
    norm.includes('massa') ||
    norm.includes('pizza') ||
    norm.includes('risoto') ||
    norm.includes('vinho')
  ) {
    const italian = RESTAURANT_MENUS['trattoria-carbone'];
    return {
      text: `🍝 **Para culinária italiana de alto nível, recomendo a Trattoria Carbone!**\n\n• **Tagliatelle ao Tartufata e Filé Mignon** (R$ 78,00)\n• **Pizza Napolitana Margherita D.O.P.** (R$ 62,00)\n• **Carpaccio Clássico com Grana Padano** (R$ 44,00)\n• **Tiramisù Tradicional** (R$ 28,00)\n\n🎁 **Benefício Loopis:** 20% off em vinhos selecionados + 15% de Cashback em Loops!`,
      matchedRestaurants: [italian],
      suggestions: [
        'O que comer na Trattoria Carbone?',
        'Ver restaurantes com Cashback no Centro',
        'Como resgatar desconto com Loops?',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/trattoria-carbone',
      actionLabel: 'Ver Trattoria Carbone',
    };
  }

  if (
    norm.includes('hamburguer') ||
    norm.includes('burger') ||
    norm.includes('lanche') ||
    norm.includes('batata frita') ||
    norm.includes('smash')
  ) {
    const burger = RESTAURANT_MENUS['soul-burger-gourmet'];
    return {
      text: `🍔 **Se você ama hambúrguer artesanal, o Soul Burger é a pedida certa!**\n\n• **Soul Bacon Cheddar Duplo** (R$ 46,00) — Blends na brasa com cheddar inglês e bacon crocante.\n• **Smash Trufado com Cogumelos** (R$ 42,00) — Prensado no pão brioche com queijo gouda e azeite trufado.\n• **Batatas Rústicas com Alecrim** (R$ 26,00)\n\n🎁 **Benefício Loopis:** 15% de Cashback em Loops em todos os pedidos!`,
      matchedRestaurants: [burger],
      suggestions: [
        'O que tem no Soul Burger?',
        'Onde comer no Centro?',
        'Qual meu saldo de Loops?',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/soul-burger-gourmet',
      actionLabel: 'Ver Soul Burger',
    };
  }

  if (
    norm.includes('bar') ||
    norm.includes('chopp') ||
    norm.includes('cerveja') ||
    norm.includes('petisco') ||
    norm.includes('happy hour') ||
    norm.includes('boteco')
  ) {
    const bar = RESTAURANT_MENUS['boteco-ori'];
    return {
      text: `🍻 **Para um Happy Hour animado com amigos, vá ao Boteco ORI!**\n\n• **Torresmo de Rolo Crocante** com geleia de pimenta (R$ 48,00)\n• **Bolinho de Costela com Requeijão** (R$ 44,00)\n• **Dadinhos de Tapioca com Queijo Canastra** (R$ 38,00)\n• **Chopp Artesanal** (R$ 16,00)\n\n🔥 **Vantagem Loopis:** Chopp em dobro + 15% cashback no Happy Hour das 17h às 20h!`,
      matchedRestaurants: [bar],
      suggestions: [
        'O que comer no Boteco ORI?',
        'Lugares no Córrego Grande',
        'Como funciona o split de conta?',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/boteco-ori',
      actionLabel: 'Ver Boteco ORI',
    };
  }

  if (
    norm.includes('japones') ||
    norm.includes('sushi') ||
    norm.includes('sashimi') ||
    norm.includes('oriental') ||
    norm.includes('omakase')
  ) {
    const sushi = RESTAURANT_MENUS['sushi-prime-floripa'];
    return {
      text: `🍣 **Para culinária japonesa contemporânea, o Nikkei Fusion & Sushi Prime é imperdível!**\n\n• **Combinado Black Salmon Trufado** com vieiras (R$ 110,00)\n• **Tartar de Atum Bluefin com Foie Gras** (R$ 68,00)\n• **Menu Omakase 7 Passos com Saquê** (R$ 280,00)\n\n🎁 **Benefício Loopis:** 20% de Cashback em Loops + Welcome Drink cortesia na reserva!`,
      matchedRestaurants: [sushi],
      suggestions: [
        'O que tem no Nikkei Fusion?',
        'Ver experiências gastronômicas',
        'Como acumular Loops?',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/sushi-prime-floripa',
      actionLabel: 'Ver Nikkei Fusion',
    };
  }

  // 3. Consultas sobre Bairros / Regiões
  if (
    norm.includes('santo antonio') ||
    norm.includes('santo antonio de lisboa') ||
    norm.includes('por do sol') ||
    norm.includes('sunset')
  ) {
    const ms = RESTAURANT_MENUS['marisqueira-sintra'];
    return {
      text: `🌅 **Santo Antônio de Lisboa** é famoso pelo pôr do sol cinematográfico, casario histórico colonial e a melhor rota de ostras da Ilha!\n\n🍽️ **Restaurante Destaque:** **Marisqueira Sintra** (20% Cashback + Sobremesa cortesia).\n✨ **Experiência imperdível:** Sunset VIP com degustação de ostras e espumante no deck sobre o mar.`,
      matchedRestaurants: [ms],
      suggestions: [
        'O que comer na Marisqueira Sintra?',
        'Ver experiências em Santo Antônio',
        'Outros bairros de Floripa',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/marisqueira-sintra',
      actionLabel: 'Conhecer Marisqueira Sintra',
    };
  }

  if (norm.includes('centro') || norm.includes('beira mar') || norm.includes('beira-mar')) {
    const centerList = [
      RESTAURANT_MENUS['trattoria-carbone'],
      RESTAURANT_MENUS['soul-burger-gourmet'],
      RESTAURANT_MENUS['sushi-prime-floripa'],
    ].filter(Boolean);

    return {
      text: `🏙️ **No Centro & Beira-Mar você tem opções gastronômicas fantásticas:**\n\n1. **Trattoria Carbone** (Italiano & Vinhos) — Massas com trufas e pizza napolitana (15% cashback).\n2. **Soul Burger** (Hambúrguer Artesanal) — Burgers na brasa e batatas rústicas (15% cashback).\n3. **Nikkei Fusion & Sushi Prime** (Japonesa) — Salmão trufado e menu Omakase (20% cashback).`,
      matchedRestaurants: centerList,
      suggestions: [
        'O que comer na Trattoria Carbone?',
        'O que tem no Soul Burger?',
        'O que tem no Nikkei Fusion?',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/trattoria-carbone',
      actionLabel: 'Ver Trattoria Carbone',
    };
  }

  if (norm.includes('barra da lagoa') || norm.includes('lagoa da conceicao') || norm.includes('lagoa')) {
    const ot = RESTAURANT_MENUS['o-timoneiro'];
    return {
      text: `🛶 **Na região da Lagoa da Conceição e Barra da Lagoa:**\n\n• **O Timoneiro** (Barra da Lagoa) — A melhor sequência de camarão da região com 25% de Cashback!\n• **Passeios de Lancha na Costa da Lagoa** — Saídas diárias com parada para almoço típico de frutos do mar.\n\nQuer conferir o cardápio do Timoneiro ou ver os passeios de barco?`,
      matchedRestaurants: [ot],
      suggestions: [
        'O que tem pra comer no Timoneiro?',
        'Ver passeios de lancha na Costa da Lagoa',
        'Restaurantes no Córrego Grande',
      ],
      actionType: 'view_restaurant',
      actionUrl: '/restaurante/o-timoneiro',
      actionLabel: 'Ver O Timoneiro',
    };
  }

  // 4. Consultas sobre Loops, Saldo, Carteira e Como Funciona
  if (
    norm.includes('saldo') ||
    norm.includes('meus loops') ||
    norm.includes('quantos loops') ||
    norm.includes('pontos') ||
    norm.includes('carteira')
  ) {
    return {
      text: `💰 **Seu saldo atual é de ${loopsBalance} Loops!**\n\n✨ **Como aproveitar seus Loops:**\n• Troque por descontos na conta dos restaurantes parceiros (1 Loop = R$ 1,00 de desconto).\n• Resgate sobremesas, cortesias e experiências exclusivas.\n• Ganhe mais Loops escaneando a NFC-e/QR Code das suas comandas ou fazendo reservas pelo app!`,
      suggestions: [
        'Como escanear cupom fiscal?',
        'Quais restaurantes dão mais cashback?',
        'O que tem pra comer na Marisqueira Sintra?',
        'Ver cupons disponíveis',
      ],
      actionType: 'view_wallet',
      actionUrl: '/carteira',
      actionLabel: 'Abrir Minha Carteira de Loops',
    };
  }

  if (
    norm.includes('escanear') ||
    norm.includes('cupom fiscal') ||
    norm.includes('nota fiscal') ||
    norm.includes('nfce') ||
    norm.includes('scanner') ||
    norm.includes('qr code') ||
    norm.includes('comanda')
  ) {
    return {
      text: `📸 **Como escanear seu Cupom Fiscal no Loopis:**\n\n1. Peça a conta ou cupom fiscal (NFC-e) no restaurante parceiro credenciado.\n2. Acesse a aba **Scanner** ou clique no botão abaixo.\n3. Aponte a câmera para o QR Code da nota fiscal ou digite a chave de acesso.\n4. A inteligência do Loopis valida o cupom e credita o Cashback em **Loops** na sua carteira na hora! 🎉`,
      suggestions: [
        'Abrir Scanner de Cupom',
        'Qual meu saldo de Loops?',
        'Quais restaurantes aceitam Loopis?',
      ],
      actionType: 'view_scanner',
      actionUrl: '/scanner',
      actionLabel: 'Abrir Scanner de Cupom',
    };
  }

  if (
    norm.includes('experiencia') ||
    norm.includes('passeio') ||
    norm.includes('lancha') ||
    norm.includes('degustacao') ||
    norm.includes('roteiro') ||
    norm.includes('tour')
  ) {
    return {
      text: `⛵ **Experiências e Tours Exclusivos Loopis em Floripa:**\n\n1. **Sunset VIP em Santo Antônio** — Ostras selecionadas + garrafa de espumante no deck (R$ 160/pessoa • 20% cashback).\n2. **Passeio de Lancha na Costa da Lagoa** — Navegação nas águas calmas da Lagoa com almoço típico incluso (R$ 240/pessoa • 25% cashback).\n3. **Menu Omakase 7 Passos com Saquê** — Alta gastronomia japonesa no Centro (R$ 280/pessoa • 20% cashback).\n4. **Fazenda de Ostras no Barco no Ribeirão** — Degustação direta das lanternas marinhas (R$ 210/pessoa • 20% cashback).`,
      suggestions: [
        'O que comer na Marisqueira Sintra?',
        'Como funciona o cashback de experiências?',
        'Ver detalhes das Experiências',
      ],
      actionType: 'view_experiences',
      actionUrl: '/experiencias',
      actionLabel: 'Ver Todas as Experiências',
    };
  }

  if (
    norm.includes('como funciona') ||
    norm.includes('o que e o loopis') ||
    norm.includes('vantagens') ||
    norm.includes('desconto') ||
    norm.includes('cashback')
  ) {
    return {
      text: `🚀 **O Loopis é o seu clube gastronômico e de fidelidade inteligente em Floripa!**\n\n1. **Descubra:** Encontre os melhores restaurantes, bares e experiências da Ilha.\n2. **Reserve & Consuma:** Ganhe até **25% de Cashback** em Loops em todas as suas visitas.\n3. **Economize:** Abata Loops na sua conta ou troque por pratos e sobremesas gratuitas!\n4. **Divida a Conta:** Use o nosso Split inteligente para pagar comandas com amigos sem complicação.`,
      suggestions: [
        'O que comer na Marisqueira Sintra?',
        'O que tem no Boteco ORI?',
        'Restaurantes no Centro',
        'Qual meu saldo de Loops?',
      ],
      actionType: 'none',
    };
  }

  // 5. Saudação / Resposta Geral Amigável
  if (
    norm.includes('ola') ||
    norm.includes('oi') ||
    norm.includes('bom dia') ||
    norm.includes('boa tarde') ||
    norm.includes('boa noite') ||
    norm.includes('e ai') ||
    norm.includes('tudo bem') ||
    norm.includes('ajuda') ||
    norm.length < 5
  ) {
    const featured = [
      RESTAURANT_MENUS['marisqueira-sintra'],
      RESTAURANT_MENUS['boteco-ori'],
      RESTAURANT_MENUS['trattoria-carbone'],
    ].filter(Boolean);

    return {
      text: `👋 **Olá! Eu sou o Loopi, seu assistente gastronômico!**\n\nPosso te ajudar a descobrir o que comer nos melhores restaurantes de Florianópolis, consultar cardápios e pratos, verificar promoções, conferir seu saldo de Loops ou encontrar passeios incríveis!\n\n💡 **Experimente perguntar:**\n• *"O que tem pra comer na Marisqueira Sintra?"*\n• *"O que comer no Boteco ORI?"*\n• *"Onde comer massas italianas?"*\n• *"Qual meu saldo de Loops?"*`,
      matchedRestaurants: featured,
      suggestions: [
        'O que tem pra comer na Marisqueira Sintra?',
        'O que comer no Boteco ORI?',
        'Onde comer massas italianas?',
        'Qual meu saldo de Loops?',
      ],
      actionType: 'none',
    };
  }

  // 6. Fallback Inteligente baseado em termos gerais
  const allSampleRestaurants = Object.values(RESTAURANT_MENUS);
  const sampleSuggestions = [
    'O que tem pra comer na Marisqueira Sintra?',
    'O que comer no Boteco ORI?',
    'Melhores opções de Frutos do Mar',
    'Qual meu saldo de Loops?',
  ];

  return {
    text: `🤔 Entendi sua busca! Para te dar a melhor recomendação gastronômica, você pode me perguntar sobre cardápios específicos (ex: *"O que tem pra comer na Marisqueira Sintra?"* ou *"O que tem no Boteco ORI?"*), tipos de culinária (frutos do mar, italiana, hambúrguer, japonesa) ou sobre seu saldo de Loops!\n\nAqui estão alguns dos parceiros mais procurados em Florianópolis:`,
    matchedRestaurants: allSampleRestaurants.slice(0, 3),
    suggestions: sampleSuggestions,
    actionType: 'none',
  };
}
