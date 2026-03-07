const axios = require("axios");

const SPOONACULAR_BASE = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;

// Reusable axios instance with default params
const spoonacular = axios.create({
  baseURL: SPOONACULAR_BASE,
  params: { apiKey: API_KEY },
  timeout: 10000,
});

/**
 * Search for recipes by ingredients
 * @param {string[]} ingredients - Array of ingredient names
 * @param {number} number - Max results (default 9)
 */
const findByIngredients = async (ingredients, number = 9) => {
  const { data } = await spoonacular.get("/recipes/findByIngredients", {
    params: {
      ingredients: ingredients.join(","),
      number,
      ranking: 2,          // maximize used ingredients
      ignorePantry: true,
    },
  });
  return data;
};

/**
 * Get full recipe information including instructions, nutrition
 * @param {number} id - Spoonacular recipe ID
 */
const getRecipeDetails = async (id) => {
  const { data } = await spoonacular.get(`/recipes/${id}/information`, {
    params: { includeNutrition: false },
  });
  return data;
};

/**
 * Search recipes by query string
 * @param {string} query
 * @param {number} number
 */
const searchRecipes = async (query, number = 9) => {
  const { data } = await spoonacular.get("/recipes/complexSearch", {
    params: {
      query,
      number,
      addRecipeInformation: true,
      fillIngredients: true,
    },
  });
  return data.results;
};

module.exports = { findByIngredients, getRecipeDetails, searchRecipes };
