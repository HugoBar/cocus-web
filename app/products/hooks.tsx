import { useState, useEffect } from "react";

export interface Product {
  id: string | number;
  name: string;
  unit: string;
  density: number;
}

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const res = await fetch("http://localhost:3001/products/", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.collection);
  };

  const createProduct = async (product: { name: string; unit: string; density: number }) => {
    await fetch("http://localhost:3001/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    await loadProducts();
  };

  const updateProduct = async (id: string | number, product: { name: string; unit: string; density: number }) => {
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    await loadProducts();
  };

  const deleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" });
    await loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loadProducts, createProduct, updateProduct, deleteProduct };
}
