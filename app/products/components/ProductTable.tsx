import React from "react";
import { Product } from "../hooks";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex bg-gray-100 font-semibold p-4">
        <div className="w-1/12">ID</div>
        <div className="w-1/4">Name</div>
        <div className="w-1/6">Unit</div>
        <div className="w-1/6">Density</div>
        <div className="w-1/3">Actions</div>
      </div>

      {products.map((p) => (
        <div
          key={p.id}
          className="flex border-t p-4 items-center justify-between"
        >
          <div className="w-1/12">{p.id}</div>
          <div className="w-1/4">{p.name}</div>
          <div className="w-1/6">{p.unit}</div>
          <div className="w-1/6">{p.density}</div>
          <div className="w-1/3 flex gap-2">
            <button
              onClick={() => onEdit(p)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(p.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
