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
  Collapse,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Recipe } from "../hooks";

interface Props {
  recipes: Recipe[];
  filter: "all" | "available" | "available_with_unavailable";
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

export default function RecipesTable({
  recipes,
  filter,
  onEdit,
  onDelete,
}: Props) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const toggleRow = (id: number) => setOpenRow(openRow === id ? null : id);

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
            <TableCell sx={{ fontWeight: "bold" }}>Prep Time</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Servings</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {recipes.map((recipe, idx) => (
            <React.Fragment key={recipe.id}>
              <TableRow
                onClick={() => toggleRow(recipe.id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    filter === "all"
                      ? idx % 2 === 0
                        ? "#fff"
                        : "#f9f9f9"
                      : recipe.available
                      ? "#e8f5e9" // light green
                      : "#ffebee", // light red
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <TableCell>{recipe.id}</TableCell>

                <TableCell>
                  {filter !== "all" && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: recipe.available ? "green" : "red",
                        marginRight: 6,
                      }}
                    />
                  )}
                  {recipe.name}
                </TableCell>

                <TableCell>{recipe.prep_time ?? "-"}</TableCell>
                <TableCell>{recipe.servings ?? "-"}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={buttonStyle}
                      disabled={true}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(recipe);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      sx={buttonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(recipe.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0 }}>
                  <Collapse in={openRow === recipe.id} timeout="auto" unmountOnExit>
                    <Box sx={{ m: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Ingredients
                      </Typography>

                      <Stack spacing={0.5} sx={{ mb: 2 }}>
                        {recipe.ingredients.map((ing, i) => (
                          <Typography key={i}>• {ing.name}</Typography>
                        ))}
                      </Stack>

                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Steps
                      </Typography>

                      <ol style={{ marginLeft: 20 }}>
                        {recipe.steps.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
