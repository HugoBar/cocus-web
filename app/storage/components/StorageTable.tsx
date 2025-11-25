"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Collapse,
} from "@mui/material";
import StorageModal from "./StorageModal";
import { StorageItem } from "../hooks";

interface StorageTableProps {
  storage: StorageItem[];
  onAdd: (payload: { product_id: string | number; quantity: number; unit: string }) => void;
  onRemove: (payload: { product_id: string | number; quantity: number; unit: string }) => void;
  onUpdate: (payload: { product_id: string | number; quantity: number }) => void;
}

export default function StorageTable({ storage, onAdd, onRemove, onUpdate }: StorageTableProps) {
  const [editRow, setEditRow] = useState<string | number | null>(null);
  const [editType, setEditType] = useState<"add" | "remove" | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editModalData, setEditModalData] = useState<{
    product_id: string | number;
    quantity: number;
    unit: string;
  }>({
    product_id: "",
    quantity: 0,
    unit: "",
  });

  const resetForm = () => {
    setEditRow(null);
    setEditType(null);
    setAmount("");
    setUnit("");
  };

  const handleConfirm = (item: StorageItem) => {
    if (!amount || Number(amount) <= 0) return;

    const payload = {
      product_id: item.product_id,
      quantity: Number(amount),
      unit,
    };

    if (editType === "add") onAdd(payload);
    if (editType === "remove") onRemove(payload);

    resetForm();
  };

  const getAvailableUnits = (baseUnit: string) => {
    if (baseUnit === "ml") return ["ml", "l"];
    if (baseUnit === "g") return ["g", "kg"];
    return [baseUnit];
  };

  const buttonStyle = {
    minWidth: 64,
    px: 2,
    py: 0.5,
    borderRadius: 1,
    textTransform: "none",
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {storage.map((item, idx) => (
              <React.Fragment key={item.id}>
                
                <TableRow
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": { backgroundColor: "#eaeaea" },
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.product_id}</TableCell>

                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          minWidth: "28px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          padding: 0,
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": { backgroundColor: "#115293" },
                        }}
                        onClick={() => {
                          setEditRow(item.id);
                          setEditType("remove");
                          setUnit(item.unit);
                        }}
                      >
                        -
                      </Button>

                      <span>
                        {item.quantity} {item.unit}
                      </span>

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          minWidth: "28px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          padding: 0,
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": { backgroundColor: "#115293" },
                        }}
                        onClick={() => {
                          setEditRow(item.id);
                          setEditType("add");
                          setUnit(item.unit);
                        }}
                      >
                        +
                      </Button>
                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={buttonStyle}
                        onClick={() => {
                          setEditModalData({
                            product_id: item.product_id,
                            quantity: item.quantity,
                            unit: item.unit,
                          });
                          setEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={editRow === item.id} timeout="auto" unmountOnExit>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ p: 2, backgroundColor: "#f0f4ff", borderRadius: 1 }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          label="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          sx={{ width: 120 }}
                        />

                        <FormControl size="small" sx={{ width: 90 }}>
                          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                            {getAvailableUnits(item.unit).map((u) => (
                              <MenuItem key={u} value={u}>
                                {u}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleConfirm(item)}
                        >
                          OK
                        </Button>

                        <Button variant="outlined" size="small" onClick={resetForm}>
                          Cancel
                        </Button>
                      </Stack>
                    </Collapse>
                  </TableCell>
                </TableRow>

              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StorageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(data) => {
          onUpdate(data);
          setEditModalOpen(false);
        }}
        initialData={editModalData}
        title="Edit Product"
      />
    </>
  );
}
