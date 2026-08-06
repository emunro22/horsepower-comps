import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import * as schema from '../src/lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...\n');

  // Create admin user
  const adminId = uuid();
  const adminHash = await bcrypt.hash('HorsepowerAdmin2026!', 12);

  await db.insert(schema.users).values({
    id: adminId,
    email: 'decolow@icloud.com',
    passwordHash: adminHash,
    name: 'Admin',
    role: 'admin',
    emailVerified: true,
  });
  console.log('✓ Admin user created: decolow@icloud.com / HorsepowerAdmin2026!');

  // Seed categories
  const categorySeed = [
    { name: 'Cars', slug: 'cars', icon: '🚗' },
    { name: 'Cash', slug: 'cash', icon: '💰' },
    { name: 'Tech', slug: 'tech', icon: '💻' },
    { name: 'Holidays', slug: 'holidays', icon: '✈️' },
    { name: 'Experiences', slug: 'experiences', icon: '🎯' },
    { name: 'Home', slug: 'home', icon: '🏠' },
    { name: 'Watches & Jewellery', slug: 'watches-jewellery', icon: '⌚' },
  ];

  for (const cat of categorySeed) {
    await db.insert(schema.categories).values({ id: uuid(), ...cat });
    console.log(`✓ Category: ${cat.name}`);
  }

  // Seed competitions
  const competitions = [
    {
      id: uuid(),
      title: 'BMW M4 Competition or £60,000 Cash',
      slug: 'bmw-m4-competition-or-60000-cash',
      description: 'Win this stunning BMW M4 Competition in Isle of Man Green, packed with 503bhp and every optional extra. Or take the £60,000 cash alternative, the choice is yours! This incredible machine features carbon ceramic brakes, M Sport exhaust system, and the iconic straight-six twin-turbo engine.',
      imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop&q=80',
      prizeValue: 7500000,
      cashAlternative: 6000000,
      ticketPrice: 199,
      totalTickets: 7999,
      ticketsSold: 5432,
      drawDate: new Date('2026-07-15T20:00:00Z'),
      category: 'cars',
      status: 'live' as const,
      featured: true,
      maxPerPerson: 100,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: '£25,000 Cash Prize',
      slug: '25000-cash-prize',
      description: 'Win a life-changing £25,000 in cold hard cash. No strings attached, paid directly to your bank account within 48 hours of the draw. Spend it however you like, pay off bills, book the holiday of a lifetime, or invest in your future.',
      imageUrl: 'https://images.unsplash.com/photo-1642961597907-fc6fbff01720?w=800&h=600&fit=crop&q=80',
      prizeValue: 2500000,
      cashAlternative: null,
      ticketPrice: 99,
      totalTickets: 4999,
      ticketsSold: 3821,
      drawDate: new Date('2026-07-10T19:00:00Z'),
      category: 'cash',
      status: 'live' as const,
      featured: true,
      maxPerPerson: 150,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: 'MacBook Pro M4 + iPad Pro Bundle',
      slug: 'macbook-pro-m4-ipad-pro-bundle',
      description: 'Win the ultimate Apple bundle! The brand new MacBook Pro with M4 chip, 16-inch Liquid Retina XDR display, 36GB RAM, and 1TB SSD. Plus an iPad Pro M4 with Apple Pencil Pro and Magic Keyboard. Everything a creative professional dreams of.',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80',
      prizeValue: 450000,
      cashAlternative: 350000,
      ticketPrice: 49,
      totalTickets: 1999,
      ticketsSold: 1287,
      drawDate: new Date('2026-07-08T20:00:00Z'),
      category: 'tech',
      status: 'live' as const,
      featured: true,
      maxPerPerson: 200,
      minimumSoldPercentage: 80,
    },
    {
      id: uuid(),
      title: 'Luxury Maldives Holiday for Two',
      slug: 'luxury-maldives-holiday-for-two',
      description: '7 nights in a stunning overwater villa in the Maldives. Includes business class flights, full board dining, spa treatments, and sunset dolphin cruise. The ultimate getaway for you and your partner.',
      imageUrl: 'https://images.unsplash.com/premium_photo-1666432045848-3fdbb2c74531?w=800&h=600&fit=crop&q=80',
      prizeValue: 1200000,
      cashAlternative: 800000,
      ticketPrice: 149,
      totalTickets: 2999,
      ticketsSold: 1150,
      drawDate: new Date('2026-07-20T20:00:00Z'),
      category: 'holidays',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 100,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: 'Rolex Submariner Date',
      slug: 'rolex-submariner-date',
      description: 'Win the iconic Rolex Submariner Date in Oystersteel with black dial. Brand new, unworn, with full box and papers. The watch that needs no introduction, a true classic that holds its value.',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop&q=80',
      prizeValue: 900000,
      cashAlternative: 700000,
      ticketPrice: 129,
      totalTickets: 1999,
      ticketsSold: 1876,
      drawDate: new Date('2026-07-05T20:00:00Z'),
      category: 'watches-jewellery',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 50,
      minimumSoldPercentage: 90,
    },
    {
      id: uuid(),
      title: 'PS5 Pro + 4K OLED TV Gaming Setup',
      slug: 'ps5-pro-4k-oled-tv-gaming-setup',
      description: 'The ultimate gaming setup! PS5 Pro console with 2TB SSD, Sony 65" A95L OLED TV, Pulse Elite headset, DualSense Edge controller, and 10 games of your choice. Game like a pro.',
      imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop&q=80',
      prizeValue: 500000,
      cashAlternative: 350000,
      ticketPrice: 79,
      totalTickets: 1499,
      ticketsSold: 890,
      drawDate: new Date('2026-07-12T20:00:00Z'),
      category: 'tech',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 100,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: 'VIP Whisky Experience Weekend',
      slug: 'vip-whisky-experience-weekend',
      description: 'An exclusive weekend experience touring the UK\'s finest distilleries. Stay at a luxury lodge, enjoy private tastings at 5 premium distilleries, gourmet dining, and take home a curated collection of rare bottles worth over £2,000.',
      imageUrl: 'https://images.unsplash.com/photo-1661286743264-3c977faa9c07?w=800&h=600&fit=crop&q=80',
      prizeValue: 500000,
      cashAlternative: 300000,
      ticketPrice: 49,
      totalTickets: 2499,
      ticketsSold: 654,
      drawDate: new Date('2026-07-25T20:00:00Z'),
      category: 'experiences',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 200,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: '£10,000 Home Renovation Fund',
      slug: '10000-home-renovation-fund',
      description: 'Win £10,000 to transform your home! Whether it\'s a new kitchen, bathroom makeover, garden redesign, or that extension you\'ve been dreaming about. Cash paid directly so you can choose your own contractors.',
      imageUrl: 'https://images.unsplash.com/photo-1661962752158-f7b15d5ec42b?w=800&h=600&fit=crop&q=80',
      prizeValue: 1000000,
      cashAlternative: null,
      ticketPrice: 99,
      totalTickets: 1999,
      ticketsSold: 1456,
      drawDate: new Date('2026-07-18T20:00:00Z'),
      category: 'home',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 100,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: 'Mercedes-AMG A45 S or £45,000 Cash',
      slug: 'mercedes-amg-a45s-or-45000-cash',
      description: 'The world\'s most powerful four-cylinder production car! This Mercedes-AMG A45 S comes in Cosmos Black with AMG Performance seats, AMG Aerodynamics package, and the incredible 421bhp turbo engine. Or take £45,000 cash.',
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&q=80',
      prizeValue: 5500000,
      cashAlternative: 4500000,
      ticketPrice: 149,
      totalTickets: 5999,
      ticketsSold: 2100,
      drawDate: new Date('2026-08-01T20:00:00Z'),
      category: 'cars',
      status: 'live' as const,
      featured: true,
      maxPerPerson: 100,
      minimumSoldPercentage: 85,
    },
    {
      id: uuid(),
      title: '£5,000 Cash Quickie',
      slug: '5000-cash-quickie',
      description: 'A quick-fire competition with amazing odds! Win £5,000 cash with only 999 tickets available. One of our most popular competitions, don\'t miss out!',
      imageUrl: 'https://images.unsplash.com/photo-1580971266928-ff5d40c194a7?w=800&h=600&fit=crop&q=80',
      prizeValue: 500000,
      cashAlternative: null,
      ticketPrice: 49,
      totalTickets: 999,
      ticketsSold: 870,
      drawDate: new Date('2026-07-03T20:00:00Z'),
      category: 'cash',
      status: 'live' as const,
      featured: false,
      maxPerPerson: 50,
      minimumSoldPercentage: 75,
    },
  ];

  for (const comp of competitions) {
    await db.insert(schema.competitions).values(comp);
    console.log(`✓ Competition: ${comp.title}`);
  }

  console.log(`\n✓ Seeding complete! ${competitions.length} competitions created.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
