// In-memory store — replace with MongoDB/PostgreSQL for production
// Each entry: { id, recipe, savedAt }
const favorites = new Map();
let nextId = 1;

// GET /api/favorites
const getFavorites = (req, res) => {
  const list = Array.from(favorites.values()).sort(
    (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
  );
  res.json({ favorites: list, count: list.size });
};

// POST /api/favorites
const addFavorite = (req, res) => {
  const { recipe } = req.body;
  if (!recipe || !recipe.title && !recipe.name) {
    return res.status(400).json({ error: "Valid recipe object required." });
  }

  const id = String(nextId++);
  const entry = { id, recipe, savedAt: new Date().toISOString() };
  favorites.set(id, entry);
  res.status(201).json(entry);
};

// DELETE /api/favorites/:id
const removeFavorite = (req, res) => {
  const { id } = req.params;
  if (!favorites.has(id)) {
    return res.status(404).json({ error: "Favorite not found." });
  }
  favorites.delete(id);
  res.json({ message: "Removed from favorites." });
};

module.exports = { getFavorites, addFavorite, removeFavorite };
