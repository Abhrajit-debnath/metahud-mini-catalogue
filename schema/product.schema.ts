import z from "zod";


// product Schema to validate against 

const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
  isAvailable: z.boolean().default(true),
});


// product type inferred from the product schema to use in the application

export type Product = z.infer<typeof productSchema>;

// update product schema to allow partial updates

export const updateProductSchema = productSchema.partial();

export default productSchema;