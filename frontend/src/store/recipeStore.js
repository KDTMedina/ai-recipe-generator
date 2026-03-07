import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "./api";

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      // ─── State ─────────────────────────────────────
      ingredients: [],
      recipes: [],
      aiRecipe: null,
      favorites: [],
      loading: false,
      aiLoading: false,
      error: null,

      // ─── Ingredient Actions ─────────────────────────
      addIngredient: (ingredient) => {
        const cleaned = ingredient.trim().toLowerCase();
        if (!cleaned || get().ingredients.includes(cleaned)) return;
        set((s) => ({ ingredients: [...s.ingredients, cleaned] }));
      },

      removeIngredient: (ingredient) =>
        set((s) => ({ ingredients: s.ingredients.filter((i) => i !== ingredient) })),

      clearIngredients: () => set({ ingredients: [] }),

      // ─── Recipe Actions ─────────────────────────────
      fetchRecipesByIngredients: async () => {
        const { ingredients } = get();
        if (!ingredients.length) return;
        set({ loading: true, error: null });
        try {
          const { data } = await api.post("/recipes/by-ingredients", { ingredients });
          set({ recipes: data.results });
        } catch (e) {
          set({ error: e.response?.data?.error || "Failed to fetch recipes." });
        } finally {
          set({ loading: false });
        }
      },

      // ─── AI Actions ────────────────────────────────
      generateAIRecipe: async (preferences = {}) => {
        const { ingredients } = get();
        if (!ingredients.length) return;
        set({ aiLoading: true, error: null, aiRecipe: null });
        try {
          const { data } = await api.post("/ai/generate", { ingredients, preferences });
          set({ aiRecipe: data.recipe });
        } catch (e) {
          set({ error: e.response?.data?.error || "AI generation failed." });
        } finally {
          set({ aiLoading: false });
        }
      },

      clearAIRecipe: () => set({ aiRecipe: null }),

      // ─── Favorites Actions ──────────────────────────
      addFavorite: (recipe) => {
        if (get().favorites.some((f) => f.id === recipe.id || f.recipe?.id === recipe.id)) return;
        const entry = { id: Date.now(), recipe, savedAt: new Date().toISOString() };
        set((s) => ({ favorites: [entry, ...s.favorites] }));
      },

      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),

      isFavorite: (recipeId) =>
        get().favorites.some((f) => f.id === recipeId || f.recipe?.id === recipeId),
    }),
    {
      name: "mise-en-place-storage",
      partialize: (s) => ({ favorites: s.favorites }),
    }
  )
);
