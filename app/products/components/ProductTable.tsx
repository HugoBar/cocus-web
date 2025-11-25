"use client";

import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button } from "@mui/material";
import { Product } from "../hooks";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const buttonStyle = {
    minWidth: 64,
    px: 2,
    py: 0.5,
    borderRadius: 1,
    textTransform: "none",
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Density</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p, idx) => (
            <TableRow
              key={p.id}
              sx={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                "&:hover": { backgroundColor: "#eaeaea" },
              }}
            >
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.unit}</TableCell>
              <TableCell>{p.density}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={buttonStyle}
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={buttonStyle}
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
