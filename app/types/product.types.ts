export interface Product {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  price: number;
  isAvailable: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
