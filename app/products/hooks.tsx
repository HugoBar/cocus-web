import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface Product {
  id: string | number;
  name: string;
  unit: string;
  density: number;
}

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, { cache: "no-store" });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      const data = await res.json();
      setProducts(data.collection);
    } catch (err: any) {
      toast.error(err.error || "Failed to load products");
    }
  };

  const createProduct = async (product: { name: string; unit: string; density: number }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Product created");
      await loadProducts();
    } catch (err: any) {
      toast.error(err.error || "Failed to create product");
    }
  };

  const updateProduct = async (id: string | number, product: { name: string; unit: string; density: number }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Product updated");
      await loadProducts();
    } catch (err: any) {
      toast.error(err.error || "Failed to update product");
    }
  };

  const deleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Product deleted");
      await loadProducts();
    } catch (err: any) {
      toast.error(err.error || "Failed to delete product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loadProducts, createProduct, updateProduct, deleteProduct };
}
