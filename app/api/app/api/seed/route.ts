import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  await prisma.product.createMany({
    data: [
      { name: 'Metahud Hoodie', price: 2499, category: 'Apparel', description: 'Premium hoodie', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', isAvailable: true },
    ],
  });
  return NextResponse.json({ message: 'Seeded' });
}