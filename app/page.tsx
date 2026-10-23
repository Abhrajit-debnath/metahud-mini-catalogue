"use client";

import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
  Badge,
} from "@mantine/core";
import {
  IconUserShield,
  IconArrowRight,
  IconSearch,
  IconShieldCheck,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center py-16 px-4">
        <Container size="md">
          {/* Main Hero Card */}
          <div className="text-center py-12 md:py-20">
            <Badge color="blue" size="lg" variant="light" mb="md" radius="sm">
              Technical Assessment Demo
            </Badge>

            <Title
              order={1}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900"
            >
              MetaHUD Mini <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Product Catalogue
              </span>
            </Title>

            <Text
              size="xl"
              c="dimmed"
              className="max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A full-stack product management platform built with Next.js,
              PostgreSQL, Prisma, and Mantine UI.
            </Text>

            <Group justify="center" gap="md" className="mb-16">
              <Button
                component={Link}
                href="/products"
                size="lg"
                color="blue"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Browse Catalogue
              </Button>

              <Button
                component={Link}
                href="/admin"
                variant="outline"
                color="gray"
                size="lg"
                radius="md"
                leftSection={<IconUserShield size={18} />}
              >
                Admin Panel
              </Button>
            </Group>

            {/* Feature Highlights Grid */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
              <Card
                padding="lg"
                radius="md"
                withBorder
                className="bg-white text-left border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <IconSearch size={22} />
                </div>
                <Text fw={700} size="md" mb={4}>
                  Instant Search & Filter
                </Text>
                <Text size="sm" c="dimmed">
                  Browse products with responsive search and category filtering in real time.
                </Text>
              </Card>

              <Card
                padding="lg"
                radius="md"
                withBorder
                className="bg-white text-left border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-3">
                  <IconDeviceLaptop size={22} />
                </div>
                <Text fw={700} size="md" mb={4}>
                  Product Details
                </Text>
                <Text size="sm" c="dimmed">
                  Dedicated product pages displaying images, pricing, and live availability.
                </Text>
              </Card>

              <Card
                padding="lg"
                radius="md"
                withBorder
                className="bg-white text-left border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3">
                  <IconShieldCheck size={22} />
                </div>
                <Text fw={700} size="md" mb={4}>
                  Protected Admin Panel
                </Text>
                <Text size="sm" c="dimmed">
                  Secure JWT authentication to create, update, delete, and toggle product status.
                </Text>
              </Card>
            </SimpleGrid>
          </div>
        </Container>
      </main>

      <footer className="py-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <Container size="xl">
          Built for Metahud Technical Assessment • Powered by Next.js & PostgreSQL
        </Container>
      </footer>
    </div>
  );
}
