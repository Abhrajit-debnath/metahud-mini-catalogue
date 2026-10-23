import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import productSchema from '@/schema/product.schema';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const all = searchParams.get('all') === 'true';

    const where: Record<string, unknown> = {
        ... { isAvailable: true },
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
        ...(category && category !== 'All' ? { category: { equals: category, mode: 'insensitive' } } : {}),
    };

    const products = await prisma.product.findMany({
        where,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const body = await request.json();

    const parsedBody = productSchema.safeParse(body);

    if (!parsedBody.success) {
        return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
    }

    const product = await prisma.product.create({
        data: parsedBody.data
    });

    return NextResponse.json({ message: 'Created', product }, { status: 201 });
}
