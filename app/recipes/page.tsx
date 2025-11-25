"use client";

import { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import useRecipes, { Recipe } from "./hooks";
import RecipesTable from "./components/RecipeTable";
import RecipeModal from "./components/RecipeModal";

export default function RecipesPage() {
  const {
    recipes,
    filter,
    loadRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | undefined>(undefined);

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Recipes</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => loadRecipes("all")}
          >
            All
          </Button>

          <Button
            variant={filter === "available" ? "contained" : "outlined"}
            onClick={() => loadRecipes("available")}
          >
            Only Available
          </Button>

          <Button
            variant={
              filter === "available_with_unavailable" ? "contained" : "outlined"
            }
            onClick={() => loadRecipes("available_with_unavailable")}
          >
            Available + Unavailable
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setEditRecipe(undefined);
              setModalOpen(true);
            }}
          >
            + Add Recipe
          </Button>
        </Stack>
      </Box>

      <RecipesTable
        recipes={recipes}
        filter={filter}
        onEdit={(recipe) => {
          setEditRecipe(recipe);
          setModalOpen(true);
        }}
        onDelete={deleteRecipe}
      />

      <RecipeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) =>
          editRecipe
            ? updateRecipe({ ...data, id: editRecipe.id })
            : createRecipe(data)
        }
        title={editRecipe ? "Edit Recipe" : "Add Recipe"}
        initialData={editRecipe}
      />
    </Box>
  );
}
