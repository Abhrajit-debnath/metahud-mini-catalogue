"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  TextInput,
  Group,
  Stack,
  Loader,
  Button,
  Badge,
  Select,
} from "@mantine/core";
import { IconSearch, IconX, IconPackageOff } from "@tabler/icons-react";
import Navbar from "@/app/components/Navbar";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types/product.types";
import { apiClient } from "@/lib/apiClient";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [availableCategories, setAvailableCategories] = useState<string[]>(["All"]);


  const fetchProducts = useCallback(async (searchQuery = "", categoryQuery = "All") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (categoryQuery && categoryQuery !== "All") params.set("category", categoryQuery);

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
      const data: Product[] = await apiClient.get(url);
      setProducts(data || []);

   
      if (!searchQuery && categoryQuery === "All" && data) {
        const unique = new Set<string>();
        data.forEach((p) => {
          if (p.category && p.category.trim()) {
            unique.add(p.category.trim());
          }
        });
        setAvailableCategories(["All", ...Array.from(unique)]);
      }
    } catch (error) {
      console.error("Failed to load products from API:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(search, category);
    }, 250);

    return () => clearTimeout(handler);
  }, [search, category, fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200 py-10 px-4">
          <Container size="xl">
            <Stack gap="xs" align="center" className="text-center">
              <Badge color="blue" variant="light" size="lg" radius="sm">
                Digital Store
              </Badge>
              <Title order={1} className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Explore MetaHUD Products
              </Title>
              <Text c="dimmed" size="lg" className="max-w-2xl">
                Browse our curated selection of developer merchandise, digital accessories, and premium gear.
              </Text>
            </Stack>

            {/* Search and Category Filter Bar */}
            <div className="mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
              <TextInput
                placeholder="Search products by name or description..."
                leftSection={<IconSearch size={18} className="text-gray-400" />}
                rightSection={
                  search ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <IconX size={16} />
                    </button>
                  ) : null
                }
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                size="md"
                className="flex-1"
                radius="md"
              />

              <div className="sm:w-52">
                <Select
                  value={category}
                  onChange={(val) => setCategory(val || "All")}
                  data={availableCategories.map((c) => ({ value: c, label: c }))}
                  size="md"
                  radius="md"
                  allowDeselect={false}
                />
              </div>
            </div>

            {/* Quick Category Chips */}
            {availableCategories.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {availableCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "filled" : "light"}
                    color="blue"
                    size="xs"
                    radius="xl"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </Container>
        </div>

        {/* Product Grid Section */}
        <Container size="xl" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <Text size="sm" c="dimmed" fw={500}>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"}
            </Text>

            {(search || category !== "All") && (
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftSection={<IconX size={14} />}
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader size="lg" color="blue" />
              <Text size="sm" c="dimmed">
                Fetching products from API...
              </Text>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300 p-8 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <IconPackageOff size={26} />
              </div>
              <Text fw={700} size="lg" mb="xs" className="text-gray-900">
                No products found
              </Text>
              <Text size="sm" c="dimmed" mb="lg">
                We couldn&apos;t find any products matching your current filters.
              </Text>
              <Button
                variant="light"
                color="blue"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
