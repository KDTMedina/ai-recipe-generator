const { Router } = require("express");
const {
  getRecipesByIngredients,
  getRecipeById,
  searchRecipesByQuery,
} = require("../controllers/recipesController");

const router = Router();

// POST /api/recipes/by-ingredients  { ingredients: ["chicken", "rice"] }
router.post("/by-ingredients", getRecipesByIngredients);

// GET  /api/recipes/search?q=pasta
router.get("/search", searchRecipesByQuery);

// GET  /api/recipes/:id
router.get("/:id", getRecipeById);

module.exports = router;
