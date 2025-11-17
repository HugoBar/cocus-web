import React from "react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; unit: string; density: number }) => void;
  initialData?: { name: string; unit: string; density: number };
  title: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ProductModalProps) {
  const [name, setName] = React.useState(initialData?.name || "");
  const [unit, setUnit] = React.useState(initialData?.unit || "");
  const [density, setDensity] = React.useState(initialData?.density?.toString() || "");

  React.useEffect(() => {
    setName(initialData?.name || "");
    setUnit(initialData?.unit || "");
    setDensity(initialData?.density?.toString() || "");
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, unit, density: parseFloat(density) || 0 });
            setName("");
            setUnit("");
            setDensity("");
          }}
          className="space-y-4"
        >
          <input
            className="border p-2 w-full rounded-md"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 w-full rounded-md"
            placeholder="Unit (e.g., kg, pcs)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 w-full rounded-md"
            placeholder="Density"
            value={density}
            onChange={(e) => setDensity(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
