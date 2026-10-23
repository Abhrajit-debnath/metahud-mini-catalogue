"use client";

import Link from "next/link";
import { Container, Group, Text, Button, Badge } from "@mantine/core";
import { IconBuildingStore, IconUserShield } from "@tabler/icons-react";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <Container size="xl" className="h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline text-inherit">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <IconBuildingStore size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text fw={700} size="lg" className="tracking-tight text-gray-900">
                MetaHUD
              </Text>
              <Badge variant="light" color="blue" size="xs">
                Catalogue
              </Badge>
            </div>
          </div>
        </Link>

        <Group gap="sm">
          <Button
            component={Link}
            href="/products"
            variant="subtle"
            color="gray"
            size="sm"
          >
            All Products
          </Button>

          <Button
            component={Link}
            href="/admin"
            variant="light"
            color="blue"
            size="sm"
            leftSection={<IconUserShield size={16} />}
          >
            Admin Panel
          </Button>
        </Group>
      </Container>
    </header>
  );
}
