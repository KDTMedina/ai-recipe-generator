const { findByIngredients, getRecipeDetails, searchRecipes } = require("../utils/spoonacular");

// POST /api/recipes/by-ingredients
const getRecipesByIngredients = async (req, res, next) => {
  try {
    const { ingredients, number } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Provide an array of ingredients." });
    }

    const cleaned = ingredients
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 15); // cap at 15 ingredients

    const recipes = await findByIngredients(cleaned, number || 9);
    res.json({ results: recipes, count: recipes.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/recipes/:id
const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: "Invalid recipe ID." });

    const recipe = await getRecipeDetails(Number(id));
    res.json(recipe);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Recipe not found." });
    }
    next(err);
  }
};

// GET /api/recipes/search?q=pasta
const searchRecipesByQuery = async (req, res, next) => {
  try {
    const { q, number } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters." });
    }

    const results = await searchRecipes(q.trim(), number ? Number(number) : 9);
    res.json({ results, count: results.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecipesByIngredients, getRecipeById, searchRecipesByQuery };
