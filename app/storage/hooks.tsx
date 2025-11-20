import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface StorageItem {
  id: string | number;
  product_id: string | number;
  product_name: string;
  quantity: number;
  unit: string;
}

export default function useStorage() {
  const [storage, setStorage] = useState<StorageItem[]>([]);

  const loadStorage = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/`, { cache: "no-store" });
      if (!res.ok) {
        const err = await res.json();
        throw err
      }
      const data = await res.json();
      setStorage(data.collection);
    } catch (err: any) {
      toast.error(err.error || "Failed to load storage");
    }
  };

  const addStockToStorage = async (product: { product_id: string | number; quantity: number; unit: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/add_product_to_storage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Storage product added");
      await loadStorage();
    } catch (err: any) {
      console.log(err)
      toast.error(err.error || "Failed to create storage product");
    }
  };

  const removeStockToStorage = async (product: { product_id: string | number; quantity: number; unit: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/remove_product_from_storage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Storage product removed");
      await loadStorage();
    } catch (err: any) {
      toast.error(err.error || "Failed to remove storaged product");
    }
  };

  const updateStorageItem = async (product: { product_id: string | number; quantity: number }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Storage product updated");
      await loadStorage();
    } catch (err: any) {
      toast.error(err.error || "Failed to update storage product");
    }
  };

  const deleteStorage = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw err
      }

      toast.success("Storage product deleted");
      await loadStorage();
    } catch (err: any) {
      toast.error(err.error || "Failed to delete storage product");
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  return { storage, loadStorage, addStockToStorage, removeStockToStorage, updateStorageItem, deleteStorage };
}
