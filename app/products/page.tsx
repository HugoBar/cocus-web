"use client";

import { useState } from "react";
import useProducts, { Product } from "./hooks";
import ProductModal from "./components/ProductModal";
import ProductTable from "./components/ProductTable";

export default function ProductsPage() {
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; unit: string; density: number }) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={handleCreate}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={deleteProduct} />
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingProduct
            ? { name: editingProduct.name, unit: editingProduct.unit, density: editingProduct.density }
            : undefined
        }
        title={editingProduct ? "Edit Product" : "New Product"}
      />
    </div>
  );
}
