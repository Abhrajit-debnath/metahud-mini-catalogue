"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Text,
  TextInput,
  Stack,
  Alert,
  Card,
  Badge,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLock,
  IconAlertCircle,
  IconArrowLeft,
  IconKey,
} from "@tabler/icons-react";
import { apiClient } from "@/lib/apiClient";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email address"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      await apiClient.post("/api/auth/login", values);
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(
        err.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      shadow="md"
      padding="xl"
      radius="lg"
      withBorder
      className="w-full max-w-md bg-white border-gray-200"
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-3">
          <IconLock size={26} />
        </div>
        <Text fw={700} size="xl" className="text-gray-900">
          Admin Login
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Sign in to manage products, categories & catalogue status
        </Text>
      </div>

      {errorMessage && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Authentication Error"
          color="red"
          variant="light"
          mb="md"
          radius="md"
        >
          {errorMessage}
        </Alert>
      )}

      {/* Demo Credentials Hint Box */}
      {/* <div className="p-3 mb-6 rounded-lg bg-gray-50 border border-gray-200 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 mb-1">
          <IconKey size={14} className="text-blue-600" />
          <span>Demo Admin Credentials:</span>
        </div>
        <div className="text-gray-600 font-mono">
          Email: <span className="text-blue-600">admin@metahud.co</span>
          <br />
          Password: <span className="text-blue-600">metahud123</span>
        </div>
      </div> */}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            withAsterisk
            label="Admin Email"
            placeholder="admin@metahud.co"
            size="md"
            radius="md"
            {...form.getInputProps("email")}
          />

          <TextInput
            withAsterisk
            label="Password"
            type="password"
            placeholder="••••••••"
            size="md"
            radius="md"
            {...form.getInputProps("password")}
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            radius="md"
            mt="sm"
            color="blue"
            loading={loading}
          >
            Sign In to Dashboard
          </Button>
        </Stack>
      </form>

      <Divider my="lg" />

      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors no-underline"
        >
          <IconArrowLeft size={14} />
          Back to Customer Catalogue
        </Link>
      </div>
    </Card>
  );
}
