import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
    }

    const text = await file.text();

    const rows = text.trim().split("\n");

    if (rows.length < 2) {
        return NextResponse.json({ error: "CSV empty" }, { status: 400 });
    }

    const headers = rows[0].split(",").map((header) => header.trim().toLowerCase());
    const requiredHeaders = ["name", "price", "category"];

    for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
            return NextResponse.json({ error: `Missing required header: ${header}` }, { status: 400 });
        }

    }

    const validProducts: any[] = [];
    const errors: any[] = [];


    for (let i = 1; i < rows.length; i++) {
        const line = rows[i].trim();
        if (!line) continue;

        const values = line.split(",").map((value) => value.trim());
        const product: Record<string, any> = {};
        headers.forEach((header, index) => {
            product[header] = values[index] || "";
        })

        try {
            if (!product.name) throw new Error("Invalid product name");
            const price = parseFloat(product.price);
            if (isNaN(price) || price <= 0) throw new Error("Invalid product price");
            if (!product.category) throw new Error("Invalid product category");

            validProducts.push({

                name: product.name,
                description: product.description,
                imageUrl: product.imageurl,
                category: product.category,
                price: parseFloat(product.price),
                isAvailable: product.isavailable ? product.isavailable.toLowerCase() === "true" : true,

            });

        } catch (error) {
            errors.push({ line: i + 1, data: product, error: (error as Error).message });
        }


    }

    let insertedCount = 0;

    if (validProducts.length > 0) {

        const result = await prisma.product.createMany({
            data: validProducts,
            skipDuplicates: true,
        })
        insertedCount = result.count;

    }

    return NextResponse.json({
        message: "Bulk upload completed",
        insertedCount,
        errors,
        totalRows: rows.length - 1,
    });



}