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
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Stack,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StorageModal from "./StorageModal";
import { StorageItem } from "../hooks";

interface StorageTableProps {
  storage: StorageItem[];
  onAdd: (payload: { product_id: string | number; quantity: number; unit: string }) => void;
  onRemove: (payload: { product_id: string | number; quantity: number; unit: string }) => void;
  onUpdate: (payload: { product_id: string | number; quantity: number }) => void;
}

export default function StorageTable({
  storage,
  onAdd,
  onRemove,
  onUpdate,
}: StorageTableProps) {
  const [editRow, setEditRow] = useState<string | number | null>(null);
  const [editType, setEditType] = useState<"add" | "remove" | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<{ product_id: string | number; quantity: number; unit: string }>({
    product_id: "",
    quantity: 0,
    unit: "",
  });

  const isMobile = useMediaQuery("(max-width:600px)");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<string | number | null>(null);

  const buttonStyle = {
    minWidth: "28px",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    padding: 0,
    margin: "0 6px",
    backgroundColor: "#1976d2",
    color: "white",
    "&:hover": { backgroundColor: "#115293" },
  };

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => {
    setMenuAnchor(e.currentTarget);
    setMenuItemId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuItemId(null);
  };

  const resetForm = () => {
    setEditRow(null);
    setEditType(null);
    setAmount("");
    setUnit("");
  };

  const handleConfirm = (item: StorageItem) => {
    if (!amount || Number(amount) <= 0) return;
    const payload = { product_id: item.product_id, quantity: Number(amount), unit };
    if (editType === "add") onAdd(payload);
    if (editType === "remove") onRemove(payload);
    resetForm();
  };

  const getAvailableUnits = (baseUnit: string) => {
    if (baseUnit === "ml") return ["ml", "l"];
    if (baseUnit === "g") return ["g", "kg"];
    return [baseUnit];
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID6</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {storage.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell sx={{ position: "relative" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: "40px" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={buttonStyle}
                        onClick={() => {
                          setEditRow(item.id);
                          setEditType("remove");
                          setUnit(item.unit);
                        }}
                      >
                        -
                      </Button>

                      <span>{item.quantity} {item.unit}</span>

                      <Button
                        variant="contained"
                        size="small"
                        sx={buttonStyle}
                        onClick={() => {
                          setEditRow(item.id);
                          setEditType("add");
                          setUnit(item.unit);
                        }}
                      >
                        +
                      </Button>
                    </Stack>

                    {/* INLINE FORM OVERLAY */}
                    {editRow === item.id && (
                      <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={1}
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 10,
                          mt: 1,
                          backgroundColor: "white",
                          p: 1,
                          borderRadius: 1,
                          boxShadow: 3,
                        }}
                      >
                        <TextField
                          type="number"
                          size="small"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          label={editType === "add" ? "Add amount" : "Remove amount"}
                        />
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                          <InputLabel>Unit</InputLabel>
                          <Select native value={unit} onChange={(e) => setUnit(e.target.value)}>
                            {getAvailableUnits(item.unit).map((u) => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <Button variant="contained" onClick={() => handleConfirm(item)}>Confirm</Button>
                        <Button variant="outlined" color="inherit" onClick={resetForm}>Cancel</Button>
                      </Stack>
                    )}
                  </TableCell>

                  {/* ACTIONS CELL */}
                  <TableCell align="right">
                    {isMobile ? (
                      <>
                        <IconButton onClick={(e) => openMenu(e, item.id)}>
                          <MoreVertIcon />
                        </IconButton>

                        <Menu anchorEl={menuAnchor} open={menuItemId === item.id} onClose={closeMenu}>
                          <MenuItem
                            onClick={() => {
                              closeMenu();
                              setEditModalData({
                                product_id: item.product_id,
                                quantity: item.quantity,
                                unit: item.unit,
                              });
                              setEditModalOpen(true);
                            }}
                          >
                            Edit
                          </MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
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
                    )}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDIT MODAL */}
      <StorageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(data) => {
          onUpdate(data);
          setEditModalOpen(false);
        }}
        initialData={editModalData}
        title={"Edit Product"}
      />
    </>
  );
}
