"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Divider,
  Loader,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconTag,
  IconClock,
  IconPackageOff,
} from "@tabler/icons-react";
import Navbar from "@/app/components/Navbar";
import { Product } from "@/app/types/product.types";
import { apiClient } from "@/lib/apiClient";

const fallbackImage =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80";

function ProductLoadingSkeleton() {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-gray-200">
      <Loader size="lg" color="blue" />
      <Text size="sm" c="dimmed">
        Loading product details from API...
      </Text>
    </div>
  );
}

function ProductDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const data: Product = await apiClient.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err: any) {
        console.error("Error loading product:", err);
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return <ProductLoadingSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3 text-red-500">
          <IconPackageOff size={26} />
        </div>
        <Text fw={700} size="lg" mb="xs" className="text-gray-900">
          Product Not Found
        </Text>
        <Text size="sm" c="dimmed" mb="lg">
          The requested product could not be loaded from the API or may have been removed.
        </Text>
        <Link href="/products" className="no-underline">
          <Button variant="light" color="blue">
            Return to Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
        {/* Product Image Column */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-[340px] md:min-h-[460px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || fallbackImage}
            alt={product.name}
            className="w-full h-full object-cover max-h-[500px]"
          />
          <div className="absolute top-4 left-4">
            {product.category && (
              <Badge color="blue" size="lg" radius="md">
                {product.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info Column */}
        <div className="flex flex-col justify-between">
          <Stack gap="md">
            <div>
              <Group justify="space-between" align="center" mb="xs">
                <Badge
                  color={product.isAvailable ? "teal" : "red"}
                  variant="light"
                  size="md"
                  leftSection={
                    product.isAvailable ? (
                      <IconCheck size={14} />
                    ) : (
                      <IconX size={14} />
                    )
                  }
                >
                  {product.isAvailable ? "In Stock" : "Currently Unavailable"}
                </Badge>
              </Group>

              <Title
                order={1}
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
              >
                {product.name}
              </Title>
            </div>

            {/* Price */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-baseline gap-2">
              <Text size="sm" c="dimmed" fw={500}>
                Price:
              </Text>
              <Text
                fw={800}
                size="xl"
                className="text-2xl sm:text-3xl text-blue-600 font-mono"
              >
                ₹{Number(product.price).toLocaleString()}
              </Text>
            </div>

            <Divider />

            {/* Description */}
            <div>
              <Text
                fw={600}
                size="sm"
                c="dimmed"
                mb={6}
                className="uppercase tracking-wider"
              >
                Description
              </Text>
              <Text
                size="md"
                className="leading-relaxed text-gray-700 whitespace-pre-line"
              >
                {product.description ||
                  "No detailed description provided for this product."}
              </Text>
            </div>

            <Divider />

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <IconTag size={16} className="text-zinc-400" />
                <span>Category: {product.category || "General"}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconClock size={16} className="text-zinc-400" />
                <span>
                  Added:{" "}
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "Recent"}
                </span>
              </div>
            </div>
          </Stack>

          <div className="pt-8">
            <Link href="/products" className="no-underline">
              <Button
                size="md"
                variant="outline"
                fullWidth
                leftSection={<IconArrowLeft size={18} />}
              >
                Continue Browsing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <Container size="lg">
          {/* Breadcrumb / Back Button */}
          <div className="mb-6">
            <Link href="/products" className="no-underline">
              <Button
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                size="sm"
              >
                Back to Catalogue
              </Button>
            </Link>
          </div>

          <Suspense fallback={<ProductLoadingSkeleton />}>
            <ProductDetailContent params={params} />
          </Suspense>
        </Container>
      </main>
    </div>
  );
}
