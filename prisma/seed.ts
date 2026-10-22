import { prisma } from "@/lib/prisma";

async function main() {

    await prisma.product.createMany({
        data: [
            { name: 'Metahud Hoodie', price: 2499, category: 'Apparel', description: 'Premium black hoodie with MetaHUD logo', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', isAvailable: true },
            { name: 'Dev Cap', price: 799, category: 'Accessories', description: 'Minimal cap for developers', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b', isAvailable: true },
            { name: 'Mechanical Keyboard', price: 4999, category: 'Gear', description: 'RGB mechanical keyboard', imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e30094d0', isAvailable: false },
        ]
    })

    console.log('Products seeded successfully!');

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });               