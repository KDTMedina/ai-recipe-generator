const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateCustomRecipe = async (ingredients, preferences = {}) => {
  const { dietary = [], cuisine = "", servings = 2 } = preferences;
  const dietaryNote = dietary.length ? `Dietary: ${dietary.join(", ")}.` : "";
  const cuisineNote = cuisine ? `Cuisine: ${cuisine}.` : "";

  const prompt = `You are a professional chef. Create a recipe using ONLY these ingredients (plus basic pantry staples):

Ingredients: ${ingredients.join(", ")}
${dietaryNote}
${cuisineNote}
Servings: ${servings}

Respond with ONLY a valid JSON object, no markdown, no backticks:
{
  "name": "Recipe Name",
  "description": "One enticing sentence",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "servings": ${servings},
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "Cuisine type",
  "ingredients": [{ "amount": "1 cup", "item": "ingredient" }],
  "instructions": ["Step 1...", "Step 2..."],
  "tips": "One helpful tip",
  "tags": ["tag1", "tag2"]
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1000,
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
};

const enhanceInstructions = async (recipeName, basicInstructions) => {
  const prompt = `Rewrite these instructions for "${recipeName}" with detailed guidance and timing cues.

Instructions:
${basicInstructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Respond with ONLY a JSON array, no markdown, no backticks:
["Step 1 enhanced...", "Step 2 enhanced..."]`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 800,
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed.instructions || basicInstructions;
};

module.exports = { generateCustomRecipe, enhanceInstructions };