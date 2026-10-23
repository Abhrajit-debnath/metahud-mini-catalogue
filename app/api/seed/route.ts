import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  await prisma.product.createMany({
    data: [
      { name: 'Metahud Hoodie', price: 2499, category: 'Apparel', description: 'Premium black hoodie with MetaHUD embroidered logo, heavyweight cotton', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', isAvailable: true },
      { name: 'Dev Cap', price: 799, category: 'Accessories', description: 'Minimal 6-panel cap for developers, adjustable strap', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b', isAvailable: true },
      { name: 'Mechanical Keyboard', price: 4999, category: 'Gear', description: 'RGB hot-swappable mechanical keyboard with blue switches', imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e30094d0', isAvailable: true },
      { name: 'Metahud Stickers Pack', price: 299, category: 'Accessories', description: 'Pack of 10 vinyl stickers - laptop, bottle, everywhere', imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71', isAvailable: true },
      { name: 'Oversized Tee', price: 1299, category: 'Apparel', description: 'Oversized graphic tee - perfect for coding nights', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', isAvailable: false },
      { name: 'Desk Mat XL', price: 1499, category: 'Gear', description: '900x400mm extended desk mat, water resistant', imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66', isAvailable: true },
      { name: 'Metahud Mug', price: 499, category: 'Accessories', description: 'Ceramic mug - 350ml, keeps code and coffee hot', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a', isAvailable: true },
      { name: 'Cargo Pants', price: 2199, category: 'Apparel', description: 'Streetwear cargo pants with 6 pockets', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', isAvailable: true },
    ],
    skipDuplicates: true,
  });
  return NextResponse.json({ message: 'Seeded 8 products successfully' });
}