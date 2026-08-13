import { FREE_ENTRY_ADDRESS } from './free-entry';

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  images?: string[];
  prizeValue: number | null;
  cashAlternative: number | null;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  drawDate: string;
  category: string;
  status: 'live' | 'coming_soon' | 'drawn' | 'sold_out';
  featured: boolean;
  maxPerPerson: number;
  minimumSoldPercentage: number;
  instantWinsCount?: number;
  instaWin?: boolean;
  instaWinDisplayMode?: 'countdown' | 'prize_count' | 'jackpot';
  instantWinsPaidOut?: number;
}

export const competitions: Competition[] = [
  {
    id: '1',
    title: 'BMW M4 Competition or £60,000 Cash',
    slug: 'bmw-m4-competition-or-60000-cash',
    description: 'Win this stunning BMW M4 Competition in Isle of Man Green, packed with 503bhp and every optional extra. Or take the £60,000 cash alternative, the choice is yours! This incredible machine features carbon ceramic brakes, M Sport exhaust system, and the iconic straight-six twin-turbo engine.',
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop&q=80',
    prizeValue: 7500000,
    cashAlternative: 6000000,
    ticketPrice: 199,
    totalTickets: 7999,
    ticketsSold: 5432,
    drawDate: '2026-07-15T20:00:00Z',
    category: 'cars',
    status: 'live',
    featured: true,
    maxPerPerson: 100,
    minimumSoldPercentage: 85,
  },
  {
    id: '2',
    title: '£25,000 Cash Prize',
    slug: '25000-cash-prize',
    description: 'Win a life-changing £25,000 in cold hard cash. No strings attached, paid directly to your bank account within 48 hours of the draw. Spend it however you like, pay off bills, book the holiday of a lifetime, or invest in your future.',
    imageUrl: 'https://images.unsplash.com/photo-1642961597907-fc6fbff01720?w=800&h=600&fit=crop&q=80',
    prizeValue: 2500000,
    cashAlternative: null,
    ticketPrice: 99,
    totalTickets: 4999,
    ticketsSold: 3821,
    drawDate: '2026-07-10T19:00:00Z',
    category: 'cash',
    status: 'live',
    featured: true,
    maxPerPerson: 150,
    minimumSoldPercentage: 85,
  },
  {
    id: '3',
    title: 'MacBook Pro M4 + iPad Pro Bundle',
    slug: 'macbook-pro-m4-ipad-pro-bundle',
    description: 'Win the ultimate Apple bundle! The brand new MacBook Pro with M4 chip, 16-inch Liquid Retina XDR display, 36GB RAM, and 1TB SSD. Plus an iPad Pro M4 with Apple Pencil Pro and Magic Keyboard. Everything a creative professional dreams of.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80',
    prizeValue: 450000,
    cashAlternative: 350000,
    ticketPrice: 49,
    totalTickets: 1999,
    ticketsSold: 1287,
    drawDate: '2026-07-08T20:00:00Z',
    category: 'tech',
    status: 'live',
    featured: true,
    maxPerPerson: 200,
    minimumSoldPercentage: 80,
  },
  {
    id: '4',
    title: 'Luxury Maldives Holiday for Two',
    slug: 'luxury-maldives-holiday-for-two',
    description: '7 nights in a stunning overwater villa in the Maldives. Includes business class flights, full board dining, spa treatments, and sunset dolphin cruise. The ultimate getaway for you and your partner.',
    imageUrl: 'https://images.unsplash.com/premium_photo-1666432045848-3fdbb2c74531?w=800&h=600&fit=crop&q=80',
    prizeValue: 1200000,
    cashAlternative: 800000,
    ticketPrice: 149,
    totalTickets: 2999,
    ticketsSold: 1150,
    drawDate: '2026-07-20T20:00:00Z',
    category: 'holidays',
    status: 'live',
    featured: false,
    maxPerPerson: 100,
    minimumSoldPercentage: 85,
  },
  {
    id: '5',
    title: 'Rolex Submariner Date',
    slug: 'rolex-submariner-date',
    description: 'Win the iconic Rolex Submariner Date in Oystersteel with black dial. Brand new, unworn, with full box and papers. The watch that needs no introduction, a true classic that holds its value.',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop&q=80',
    prizeValue: 900000,
    cashAlternative: 700000,
    ticketPrice: 129,
    totalTickets: 1999,
    ticketsSold: 1876,
    drawDate: '2026-07-05T20:00:00Z',
    category: 'watches-jewellery',
    status: 'live',
    featured: false,
    maxPerPerson: 50,
    minimumSoldPercentage: 90,
  },
  {
    id: '6',
    title: 'PS5 Pro + 4K OLED TV Gaming Setup',
    slug: 'ps5-pro-4k-oled-tv-gaming-setup',
    description: 'The ultimate gaming setup! PS5 Pro console with 2TB SSD, Sony 65" A95L OLED TV, Pulse Elite headset, DualSense Edge controller, and 10 games of your choice. Game like a pro.',
    imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop&q=80',
    prizeValue: 500000,
    cashAlternative: 350000,
    ticketPrice: 79,
    totalTickets: 1499,
    ticketsSold: 890,
    drawDate: '2026-07-12T20:00:00Z',
    category: 'tech',
    status: 'live',
    featured: false,
    maxPerPerson: 100,
    minimumSoldPercentage: 85,
  },
  {
    id: '7',
    title: 'VIP Whisky Experience Weekend',
    slug: 'vip-whisky-experience-weekend',
    description: 'An exclusive weekend experience touring the UK\'s finest distilleries. Stay at a luxury lodge, enjoy private tastings at 5 premium distilleries, gourmet dining, and take home a curated collection of rare bottles worth over £2,000.',
    imageUrl: 'https://images.unsplash.com/photo-1661286743264-3c977faa9c07?w=800&h=600&fit=crop&q=80',
    prizeValue: 500000,
    cashAlternative: 300000,
    ticketPrice: 49,
    totalTickets: 2499,
    ticketsSold: 654,
    drawDate: '2026-07-25T20:00:00Z',
    category: 'experiences',
    status: 'live',
    featured: false,
    maxPerPerson: 200,
    minimumSoldPercentage: 85,
  },
  {
    id: '8',
    title: '£10,000 Home Renovation Fund',
    slug: '10000-home-renovation-fund',
    description: 'Win £10,000 to transform your home! Whether it\'s a new kitchen, bathroom makeover, garden redesign, or that extension you\'ve been dreaming about. Cash paid directly so you can choose your own contractors.',
    imageUrl: 'https://images.unsplash.com/photo-1661962752158-f7b15d5ec42b?w=800&h=600&fit=crop&q=80',
    prizeValue: 1000000,
    cashAlternative: null,
    ticketPrice: 99,
    totalTickets: 1999,
    ticketsSold: 1456,
    drawDate: '2026-07-18T20:00:00Z',
    category: 'home',
    status: 'live',
    featured: false,
    maxPerPerson: 100,
    minimumSoldPercentage: 85,
  },
  {
    id: '9',
    title: 'Mercedes-AMG A45 S or £45,000 Cash',
    slug: 'mercedes-amg-a45s-or-45000-cash',
    description: 'The world\'s most powerful four-cylinder production car! This Mercedes-AMG A45 S comes in Cosmos Black with AMG Performance seats, AMG Aerodynamics package, and the incredible 421bhp turbo engine. Or take £45,000 cash.',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&q=80',
    prizeValue: 5500000,
    cashAlternative: 4500000,
    ticketPrice: 149,
    totalTickets: 5999,
    ticketsSold: 2100,
    drawDate: '2026-08-01T20:00:00Z',
    category: 'cars',
    status: 'live',
    featured: true,
    maxPerPerson: 100,
    minimumSoldPercentage: 85,
  },
  {
    id: '10',
    title: '£5,000 Cash Quickie',
    slug: '5000-cash-quickie',
    description: 'A quick-fire competition with amazing odds! Win £5,000 cash with only 999 tickets available. One of our most popular competitions, don\'t miss out!',
    imageUrl: 'https://images.unsplash.com/photo-1580971266928-ff5d40c194a7?w=800&h=600&fit=crop&q=80',
    prizeValue: 500000,
    cashAlternative: null,
    ticketPrice: 49,
    totalTickets: 999,
    ticketsSold: 870,
    drawDate: '2026-07-03T20:00:00Z',
    category: 'cash',
    status: 'live',
    featured: false,
    maxPerPerson: 50,
    minimumSoldPercentage: 75,
  },
];

export const faqs = [
  {
    question: 'How does Horse Power Competitions work?',
    answer: 'Horse Power Competitions runs prize competitions where you purchase tickets for a chance to win incredible prizes. Each competition has a set number of tickets and a draw date. Once the minimum ticket threshold is met and the draw date arrives, we randomly select a winner using a verified random number generator. It\'s that simple!',
  },
  {
    question: 'Is Horse Power Competitions legitimate?',
    answer: 'Absolutely! Horse Power Competitions is a UK-based business operating fully within UK competition law. All draws are conducted transparently using provably fair random number generation, and winners are announced on our website and social media channels.',
  },
  {
    question: 'How are winners chosen?',
    answer: 'Winners are selected using a cryptographically secure random number generator. The draw is conducted live on our social media channels so you can watch in real-time. Each ticket has an equal chance of winning.',
  },
  {
    question: 'When will I receive my prize?',
    answer: 'Cash prizes are transferred within 48 hours of the draw. Physical prizes (cars, tech, watches) are typically delivered within 14 working days. Holiday prizes are booked in consultation with the winner to suit their schedule.',
  },
  {
    question: 'Can I enter from anywhere in the UK?',
    answer: 'Yes! Our competitions are open to anyone in the UK aged 18 or over. Prizes can be delivered anywhere in mainland UK, and cash prizes are transferred directly to your bank.',
  },
  {
    question: 'Is there a free entry method?',
    answer: `Yes. In accordance with UK competition law, every competition can also be entered for free by post, with no purchase necessary, for an equal chance of winning. Write your name, address, email, date of birth, and the competition name on a postcard and post it to: ${FREE_ENTRY_ADDRESS}. Full details can be found in our Terms & Conditions.`,
  },
  {
    question: 'How many tickets can I buy?',
    answer: 'Each competition has a maximum ticket limit per person, which is displayed on the competition page. This ensures fairness and gives everyone a great chance of winning.',
  },
  {
    question: 'What happens if the minimum ticket threshold isn\'t met?',
    answer: 'Each competition has a minimum sold percentage (typically 85%). If this threshold is not met by the draw date, the competition is automatically extended, up to a maximum of 30 days past the original draw date. If the threshold still isn\'t met at that point, we\'ll either draw a winner from the tickets sold, or refund entrants for that competition. The threshold and countdown are clearly displayed on each competition page.',
  },
  {
    question: 'Can I choose the cash alternative instead of the prize?',
    answer: 'Yes! Where a cash alternative is offered, the winner can choose between the prize or the cash amount stated. This decision is made after winning and you\'ll have 7 days to decide.',
  },
  {
    question: 'How do I know the competitions are fair?',
    answer: 'Every draw uses a verified random number generator with results published publicly. Our draw process is fully auditable and we publish the winning ticket number, time of draw, and verification hash for complete transparency.',
  },
];
