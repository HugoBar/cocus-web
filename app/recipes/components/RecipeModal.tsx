"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Recipe } from "../hooks";

interface ProductOption {
  id: number;
  name: string;
  unit: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Recipe, "id">) => void;
  title: string;
  initialData?: Omit<Recipe, "id">;
}

export default function RecipeModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
}: RecipeModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState<number | "">("");
  const [servings, setServings] = useState<number | "">("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<
    { product_id: number | null; quantity: number; unit: string }[]
  >([{ product_id: null, quantity: 0, unit: "" }]);
  const [products, setProducts] = useState<ProductOption[]>([]);

  // Load products from service
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
      const data = await res.json();
      setProducts(data.collection);
    };
    fetchProducts();
  }, []);

  // Prefill form for edit
  useEffect(() => {
    if (!isOpen) return;

    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPrepTime(initialData?.prep_time || "");
    setServings(initialData?.servings || "");
    setSteps(initialData?.steps?.length ? initialData.steps : [""]);

    if (initialData && products.length > 0) {
      const mappedIngredients = initialData.ingredients.map((ing) => ({
        product_id: ing.product_id || null,
        quantity: ing.quantity || 0,
        unit: ing.unit || "",
      }));
      setIngredients(mappedIngredients.length ? mappedIngredients : [{ product_id: null, quantity: 0, unit: "" }]);
    }
  }, [initialData, products, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setPrepTime("");
      setServings("");
      setSteps([""]);
      setIngredients([{ product_id: null, quantity: 0, unit: "" }]);
    }
  }, [isOpen]);

  // Steps handlers
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const addStep = () => setSteps([...steps, ""]);

  // Ingredients handlers
  const handleIngredientChange = (
    index: number,
    field: "product_id" | "quantity" | "unit",
    value: any
  ) => {
    const newIngredients = [...ingredients];
    if (field === "product_id") {
      newIngredients[index].product_id = value;
      const product = products.find((p) => p.id === value);
      if (product && !newIngredients[index].unit) newIngredients[index].unit = product.unit;
    } else if (field === "quantity") {
      newIngredients[index].quantity = Number(value);
    } else if (field === "unit") {
      newIngredients[index].unit = value;
    }
    setIngredients(newIngredients);
  };
  const addIngredient = () =>
    setIngredients([...ingredients, { product_id: null, quantity: 0, unit: "" }]);

  // Unit options
  const getAvailableUnits = (product_id: number | null, currentUnit: string) => {
    const product = products.find((p) => p.id === product_id);
    if (!product) return ["count"];
    if (product.unit === "g") return ["g", "kg"];
    if (product.unit === "ml") return ["ml", "l"];
    return [product.unit || currentUnit || "count"];
  };

  // Submit
  const handleSubmit = () => {
    const payload: Omit<Recipe, "id"> = {
      name,
      description,
      prep_time: Number(prepTime),
      servings: Number(servings),
      steps: steps.filter((s) => s.trim() !== ""),
      ingredients: ingredients
        .filter((ing) => ing.product_id !== null)
        .map((ing) => {
          const product = products.find((p) => p.id === ing.product_id)!;
          return {
            product_id: ing.product_id!,
            name: product.name,
            quantity: ing.quantity,
            unit: ing.unit,
          };
        }),
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Prep Time"
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            fullWidth
          />

          {/* Ingredients */}
          <Stack spacing={1}>
            {ingredients.map((ing, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => option.name}
                  value={products.find((p) => p.id === ing.product_id) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(e, newValue) => handleIngredientChange(idx, "product_id", newValue?.id || null)}
                  renderInput={(params) => <TextField {...params} label={`Ingredient ${idx + 1}`} fullWidth />}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)}
                  sx={{ width: 100 }}
                />
                <FormControl sx={{ width: 100 }}>
                  <Select
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
                  >
                    {getAvailableUnits(ing.product_id, ing.unit).map((u) => (
                      <MenuItem key={u} value={u}>{u}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {idx === ingredients.length - 1 && (
                  <IconButton onClick={addIngredient} color="primary">
                    <AddIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>

          {/* Steps */}
          <Stack spacing={1}>
            {steps.map((step, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <TextField
                  label={`Step ${idx + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  fullWidth
                />
                {idx === steps.length - 1 && (
                  <IconButton onClick={addStep} color="primary">
                    <AddIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
