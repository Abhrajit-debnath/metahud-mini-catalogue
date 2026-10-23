"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Switch,
  Loader,
  Alert,
  SimpleGrid,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconBuildingStore,
  IconLogout,
  IconAlertCircle,
  IconCheck,
  IconPackage,
  IconEyeCheck,
  IconEyeOff,
  IconRefresh,
} from "@tabler/icons-react";
import { Product } from "@/app/types/product.types";
import { apiClient } from "@/lib/apiClient";

export default function AdminDashboardPage() {
  const router = useRouter();

 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);


  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      imageUrl: "",
      isAvailable: true,
    },
    validate: {
      name: (val) => (val.trim().length > 0 ? null : "Product name is required"),
      price: (val) => (val >= 0 ? null : "Price must be a positive number"),
      category: (val) => (val.trim().length > 0 ? null : "Category is required"),
    },
  });

 
  // Fetch products 
  const fetchProducts = useCallback(async (query = "", category = "") => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const url = query.trim()
        ? `/api/products?all=true&q=${encodeURIComponent(query.trim())}`
        : "/api/products?all=true";

      const data: Product[] = await apiClient.get(url);
      setProducts(data || []);
    } catch (err: any) {
      console.error("Failed to load admin products:", err);
      setErrorMessage(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search, categoryFilter !== "All" ? categoryFilter : "");
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);


  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout", {});
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    }
  };


  const openAddModal = () => {
    setEditingProduct(null);
    form.reset();
    form.setValues({
      name: "",
      price: 0,
      category: "Apparel",
      description: "",
      imageUrl: "",
      isAvailable: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setValues({
      name: product.name,
      price: Number(product.price),
      category: product.category || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      isAvailable: product.isAvailable,
    });
    setModalOpen(true);
  };


  const handleSubmitProduct = async (values: typeof form.values) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      const payload = {
        name: values.name.trim(),
        price: Number(values.price),
        category: values.category.trim(),
        description: values.description.trim() || undefined,
        imageUrl: values.imageUrl.trim() || undefined,
        isAvailable: values.isAvailable,
      };

      if (editingProduct) {
    
        await apiClient.put(`/api/products/${editingProduct.id}`, payload);
        setSuccessMessage(`Product "${values.name}" updated successfully!`);
      } else {

        await apiClient.post("/api/products", payload);
        setSuccessMessage(`Product "${values.name}" created successfully!`);
      }

      setModalOpen(false);
      await fetchProducts(search);

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Save product failed:", err);
      setErrorMessage(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleToggleAvailability = async (product: Product) => {
    const newStatus = !product.isAvailable;

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
    );

    try {
      await apiClient.put(`/api/products/${product.id}`, {
        isAvailable: newStatus,
      });
    } catch (err: any) {
      console.error("Toggle availability failed:", err);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: product.isAvailable } : p))
      );
      setErrorMessage("Failed to update availability status.");
    }
  };


  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };


  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await apiClient.del(`/api/products/${productToDelete.id}`);
      setSuccessMessage(`Product "${productToDelete.name}" deleted.`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchProducts(search);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Delete product failed:", err);
      setErrorMessage(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation
  const totalCount = products.length;
  const availableCount = products.filter((p) => p.isAvailable).length;
  const unavailableCount = totalCount - availableCount;



  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Admin Navbar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <Container size="xl" className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 no-underline text-inherit">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <IconBuildingStore size={20} />
              </div>
              <Text fw={700} size="md" className="tracking-tight text-gray-900">
                MetaHUD
              </Text>
            </Link>
            <Badge color="red" variant="light" size="sm">
              Admin Portal
            </Badge>
          </div>

          <Group gap="sm">
            <Button
              component={Link}
              href="/products"
              variant="subtle"
              color="gray"
              size="sm"
            >
              View Catalogue
            </Button>

            <Button
              onClick={handleLogout}
              variant="light"
              color="red"
              size="sm"
              leftSection={<IconLogout size={16} />}
            >
              Sign Out
            </Button>
          </Group>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <Container size="xl">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Title order={1} className="text-2xl sm:text-3xl font-bold tracking-tight">
                Product Inventory Management
              </Title>
              <Text size="sm" c="dimmed" mt={2}>
                Add, edit, remove, and toggle availability of your digital products.
              </Text>
            </div>

            <Group>
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                leftSection={<IconRefresh size={16} />}
                onClick={() => fetchProducts(search)}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                onClick={openAddModal}
                color="blue"
                size="md"
                radius="md"
                leftSection={<IconPlus size={18} />}
              >
                Add New Product
              </Button>
            </Group>
          </div>

          {/* Messages */}
          {successMessage && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Success"
              color="teal"
              mb="md"
              radius="md"
              withCloseButton
              onClose={() => setSuccessMessage(null)}
            >
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              mb="md"
              radius="md"
              withCloseButton
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Quick Metrics */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
            <Card padding="md" radius="md" withBorder className="bg-white border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" fw={600} className="uppercase tracking-wider">
                    Total Products
                  </Text>
                  <Text fw={800} size="xl" className="text-2xl font-mono mt-1">
                    {totalCount}
                  </Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <IconPackage size={22} />
                </div>
              </Group>
            </Card>

            <Card padding="md" radius="md" withBorder className="bg-white border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" fw={600} className="uppercase tracking-wider">
                    Available / In Stock
                  </Text>
                  <Text fw={800} size="xl" className="text-2xl font-mono text-teal-600 mt-1">
                    {availableCount}
                  </Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <IconEyeCheck size={22} />
                </div>
              </Group>
            </Card>

            <Card padding="md" radius="md" withBorder className="bg-white border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" fw={600} className="uppercase tracking-wider">
                    Marked Unavailable
                  </Text>
                  <Text fw={800} size="xl" className="text-2xl font-mono text-red-500 mt-1">
                    {unavailableCount}
                  </Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <IconEyeOff size={22} />
                </div>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Filter Bar */}
          <Card padding="md" radius="md" withBorder className="mb-6 bg-white border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <TextInput
                placeholder="Search products by title, description..."
                leftSection={<IconSearch size={16} className="text-zinc-400" />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                size="sm"
                className="flex-1"
                radius="md"
              />

           
            </div>
          </Card>

          {/* Products Table Card */}
          <Card padding="0" radius="md" withBorder className="bg-white border-gray-200 overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader size="md" color="blue" />
                <Text size="sm" c="dimmed">
                  Loading inventory...
                </Text>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <Text fw={600} size="md" mb="xs" className="text-gray-800">
                  No products found
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  {search 
                    ? "Try adjusting your search query."
                    : "Your catalogue is currently empty."}
                </Text>
                <Button size="sm" color="blue" onClick={openAddModal}>
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover className="bg-white">
                  <Table.Thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wider border-b border-gray-200">
                    <Table.Tr>
                      <Table.Th style={{ width: 60 }}>Item</Table.Th>
                      <Table.Th>Product Details</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Availability Status</Table.Th>
                      <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {products.map((product) => (
                      <Table.Tr key={product.id}>
                    
                        <Table.Td>
      
                          <img
                            src={product.imageUrl || fallbackImage}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                        </Table.Td>

                        {/* Title & Description */}
                        <Table.Td>
                          <Text fw={600} size="sm" className="text-gray-900">
                            {product.name}
                          </Text>
                          <Text size="xs" c="dimmed" className="line-clamp-1 max-w-md">
                            {product.description || "No description provided"}
                          </Text>
                        </Table.Td>

                        {/* Category */}
                        <Table.Td>
                          <Badge color="blue" variant="light" size="sm">
                            {product.category || "General"}
                          </Badge>
                        </Table.Td>

                        {/* Price */}
                        <Table.Td>
                          <Text fw={700} size="sm" className="font-mono text-gray-900">
                            ₹{Number(product.price).toLocaleString()}
                          </Text>
                        </Table.Td>

                        {/* 1-Click Availability Toggle */}
                        <Table.Td>
                          <Group gap="xs">
                            <Switch
                              checked={product.isAvailable}
                              onChange={() => handleToggleAvailability(product)}
                              color="teal"
                              size="sm"
                            />
                            <Badge
                              color={product.isAvailable ? "teal" : "red"}
                              variant="light"
                              size="xs"
                            >
                              {product.isAvailable ? "In Stock" : "Unavailable"}
                            </Badge>
                          </Group>
                        </Table.Td>

                        {/* Action buttons */}
                        <Table.Td style={{ textAlign: "right" }}>
                          <Group gap="xs" justify="flex-end">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => openEditModal(product)}
                              title="Edit product"
                            >
                              <IconEdit size={18} />
                            </ActionIcon>

                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => openDeleteModal(product)}
                              title="Delete product"
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Card>
        </Container>
      </main>

      {/* Add / Edit Product Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Text fw={700} size="lg">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Text>
        }
        size="lg"
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmitProduct)}>
          <Stack gap="md">
            <TextInput
              withAsterisk
              label="Product Name"
              placeholder="e.g. MetaHUD Mechanical Keyboard"
              {...form.getInputProps("name")}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <NumberInput
                withAsterisk
                label="Price (₹)"
                placeholder="2499"
                min={0}
                {...form.getInputProps("price")}
              />

              <TextInput
                withAsterisk
                label="Category"
                placeholder="e.g. Apparel, Accessories, Gear"
                {...form.getInputProps("category")}
              />
            </SimpleGrid>

            <TextInput
              label="Image URL"
              placeholder="https://images.unsplash.com/photo-..."
              description="Direct link to a JPEG, PNG, or WebP image"
              {...form.getInputProps("imageUrl")}
            />

            <Textarea
              label="Description"
              placeholder="Detailed description of the product features..."
              minRows={3}
              {...form.getInputProps("description")}
            />

            <Switch
              label="Mark product as available in catalogue"
              description="Unavailable products are hidden from the customer-facing catalogue"
              checked={form.values.isAvailable}
              onChange={(e) =>
                form.setFieldValue("isAvailable", e.currentTarget.checked)
              }
              color="teal"
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue" loading={submitting}>
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={
          <Text fw={700} size="lg" c="red">
            Delete Product
          </Text>
        }
        size="sm"
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-gray-900">
              &quot;{productToDelete?.name}&quot;
            </span>
            ? This action cannot be undone.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleConfirmDelete}
              loading={deleting}
              leftSection={<IconTrash size={16} />}
            >
              Confirm Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
