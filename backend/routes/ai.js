const { Router } = require("express");
const { generateRecipe, enhanceRecipe } = require("../controllers/aiController");

const router = Router();

// POST /api/ai/generate  { ingredients: [...], preferences: { dietary: [], cuisine: "" } }
router.post("/generate", generateRecipe);

// POST /api/ai/enhance   { recipeName: "...", instructions: [...] }
router.post("/enhance", enhanceRecipe);

module.exports = router;
