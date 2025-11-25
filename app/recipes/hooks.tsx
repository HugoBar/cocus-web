import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface Recipe {
  id: number;
  name: string;
  description: string;
  prep_time: number;
  servings: number;
  steps: string[];
  available?: boolean;
  ingredients: {
    name?: string;
    product_id?: number;
    quantity?: number;
    unit?: string;
  }[];
}

export type RecipesFilter =
  | "all"
  | "available"
  | "available_with_unavailable";

export default function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<RecipesFilter>("all");

  const loadRecipes = async (selectedFilter: RecipesFilter = filter) => {
    try {
      let url = "";

      if (selectedFilter === "all") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/`;
      } else if (selectedFilter === "available") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/available_recipes`;
      } else if (selectedFilter === "available_with_unavailable") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/available_recipes?include_unavailable=true`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw await res.json();

      const data = await res.json();
      setRecipes(data.collection);
      setFilter(selectedFilter);
    } catch (err: any) {
      toast.error(err.error || "Failed to load recipes");
    }
  };

  const createRecipe = async (recipe: Omit<Recipe, "id">) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe }),
      });

      if (!res.ok) throw await res.json();

      toast.success("Recipe added");
      await loadRecipes(filter);
    } catch (err: any) {
      toast.error(err.error || "Failed to add recipe");
    }
  };

  const updateRecipe = async (recipe: Recipe) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipe.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        }
      );

      if (!res.ok) throw await res.json();

      toast.success("Recipe updated");
      await loadRecipes(filter);
    } catch (err: any) {
      toast.error(err.error || "Failed to update recipe");
    }
  };

  const deleteRecipe = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw await res.json();

      toast.success("Recipe deleted");
      await loadRecipes(filter);
    } catch (err: any) {
      toast.error(err.error || "Failed to delete recipe");
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return {
    recipes,
    filter,
    loadRecipes,
    setFilter,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
