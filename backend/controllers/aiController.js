const { generateCustomRecipe, enhanceInstructions } = require("../utils/openai");

// POST /api/ai/generate
const generateRecipe = async (req, res, next) => {
  try {
    const { ingredients, preferences } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Provide an array of ingredients." });
    }

    const recipe = await generateCustomRecipe(ingredients, preferences || {});
    res.json({ recipe, source: "ai-generated" });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/enhance
const enhanceRecipe = async (req, res, next) => {
  try {
    const { recipeName, instructions } = req.body;

    if (!recipeName || !instructions || !Array.isArray(instructions)) {
      return res.status(400).json({ error: "Provide recipeName and instructions array." });
    }

    const enhanced = await enhanceInstructions(recipeName, instructions);
    res.json({ instructions: enhanced });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateRecipe, enhanceRecipe };
