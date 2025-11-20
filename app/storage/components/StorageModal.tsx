import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Autocomplete } from "@mui/material";

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { product_id: string | number; quantity: number; unit: string }) => void;
  initialData?: { product_id: string | number; quantity: number; unit: string };
  title: string;
}

interface ProductOption {
  id: string | number;
  name: string;
  unit: string;
}

export default function StorageModal({ isOpen, onClose, onSubmit, initialData, title }: StorageModalProps) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
      const data = await res.json();
      setProducts(data.collection);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData) {
      setQuantity(initialData.quantity);
      setUnit(initialData.unit);
      const prod = products.find((p) => p.id === initialData.product_id) || null;
      setSelectedProduct(prod);
    } else {
      setQuantity(0);
      setUnit("");
      setSelectedProduct(null);
    }
  }, [initialData, products]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedProduct) return;
    onSubmit({ product_id: selectedProduct.id, quantity, unit });
    setSelectedProduct(null);
    setQuantity(0);
    setUnit("");
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <h2 className="text-xl font-semibold">{title}</h2>

        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          value={selectedProduct}
          onChange={(e, newValue) => setSelectedProduct(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Product" />}
          disabled={!!initialData} // disable changing product when editing
        />

        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <TextField
          label="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          disabled={!!initialData}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}
