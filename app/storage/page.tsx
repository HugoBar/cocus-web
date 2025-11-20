"use client";

import { useState } from "react";
import useStorage from "./hooks";
import StorageModal from "./components/StorageModal";
import StorageTable from "./components/StorageTable";
import { Button, Typography, Box } from "@mui/material";

export default function StoragePage() {
  const { storage, addStockToStorage, removeStockToStorage, updateStorageItem } = useStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Storage</Typography>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          + Add Stock
        </Button>
      </Box>

      {storage.length === 0 ? (
        <Typography>No storage items yet.</Typography>
      ) : (
        <StorageTable
          storage={storage}
          onAdd={addStockToStorage}
          onRemove={removeStockToStorage}
          onUpdate={updateStorageItem}
        />
      )}

      {/* Add Stock Modal */}
      <StorageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addStockToStorage}
        title={"New Product"}
      />
    </Box>
  );
}
