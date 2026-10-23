"use client";

import Link from "next/link";
import { Card, Text, Badge, Button, Group, Stack, Image } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Product } from "@/app/types/product.types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 bg-white border-gray-200"
    >

      <Card.Section className="relative overflow-hidden bg-gray-100 h-52">
        <Image
          src={product.imageUrl || fallbackImage}
          h={208}
          w="100%"
          fit="cover"
          alt={product.name}
          fallbackSrc={fallbackImage}
          className="hover:scale-105 transition-transform duration-300"
        />                     

        <div className="absolute top-3 left-3 flex gap-2">
          {product.category && (
            <Badge color="blue" variant="filled" size="sm" radius="sm">
              {product.category}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Badge
            color={product.isAvailable ? "teal" : "red"}
            variant="filled"
            size="sm"
            radius="sm"
          >
            {product.isAvailable ? "In Stock" : "Unavailable"}
          </Badge>
        </div>
      </Card.Section>

      <Stack gap="xs" mt="md" className="flex-1 justify-between">
        <div>
          <Group justify="space-between" align="baseline" mb={4}>
            <Text fw={700} size="lg" className="line-clamp-1 text-gray-900">
              {product.name}
            </Text>
            <Text fw={700} size="lg" c="blue" className="shrink-0 font-mono">
              ₹{Number(product.price).toLocaleString()}
            </Text>
          </Group>

          <Text size="sm" c="dimmed" className="line-clamp-2 min-h-10">
            {product.description || "No description provided."}
          </Text>
        </div>

        <Button
          component={Link}
          href={`/products/${product.id}`}
          variant="light"
          color="blue"
          fullWidth
          radius="md"
          mt="sm"
          rightSection={<IconArrowRight size={16} />}
        >
          View Details
        </Button>
      </Stack>
    </Card>
  );
}
