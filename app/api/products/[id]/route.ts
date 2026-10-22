import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateProductSchema } from '@/schema/product.schema';
'@/schema/product.schema';

type Params = { params: { id: string } }



// handle GET request to fetch a product by its ID

export async function GET(request: Request, { params }: Params) {

    const { id } = params


    const product = await prisma.product.findUnique({
        where: {
            id
        }
    })


    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}



// handle PUT request to update a product by its ID


export async function PUT(request: Request, { params }: Params) {

    const { id } = params

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }



    const updatedProduct = await prisma.product.update({
        where: {
            id
        }, data: body
    })


    return NextResponse.json({ message: 'Updated', updatedProduct }, { status: 200, });
}

// handle DELETE request to delete a product by its ID

export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted', status: 200 });
}
