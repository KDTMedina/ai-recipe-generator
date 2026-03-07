import { useState } from "react";
import { Sparkles, Search, Loader2, RefreshCw } from "lucide-react";
import { useRecipeStore } from "../store/recipeStore";
import IngredientInput from "../components/IngredientInput";
import RecipeCard from "../components/RecipeCard";
import toast from "react-hot-toast";
import styles from "./Home.module.css";

const PREFERENCE_OPTIONS = {
  dietary: ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto"],
  cuisine: ["Italian", "Asian", "Mexican", "Mediterranean", "American", "Indian"],
};

export default function Home() {
  const [preferences, setPreferences] = useState({ dietary: [], cuisine: "" });
  const {
    ingredients, recipes, aiRecipe,
    loading, aiLoading, error,
    fetchRecipesByIngredients, generateAIRecipe, clearAIRecipe,
  } = useRecipeStore();

  const handleSearch = async () => {
    if (!ingredients.length) return toast.error("Add at least one ingredient.");
    await fetchRecipesByIngredients();
  };

  const handleAIGenerate = async () => {
    if (!ingredients.length) return toast.error("Add at least one ingredient.");
    clearAIRecipe();
    await generateAIRecipe(preferences);
  };

  const toggleDietary = (item) => {
    setPreferences((p) => ({
      ...p,
      dietary: p.dietary.includes(item)
        ? p.dietary.filter((d) => d !== item)
        : [...p.dietary, item],
    }));
  };

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>✦ AI-Powered</p>
        <h1 className={styles.heroTitle}>
          What's in your<br />
          <em>kitchen today?</em>
        </h1>
        <p className={styles.subtitle}>
          Tell us your ingredients — we'll find recipes and craft something unique just for you.
        </p>
      </section>

      {/* Input Section */}
      <section className={styles.inputSection}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Your Ingredients</h2>
          <IngredientInput />

          {/* Preferences */}
          <div className={styles.prefs}>
            <div className={styles.prefGroup}>
              <span className={styles.prefLabel}>Dietary</span>
              <div className={styles.chips}>
                {PREFERENCE_OPTIONS.dietary.map((d) => (
                  <button
                    key={d}
                    className={`${styles.prefChip} ${preferences.dietary.includes(d) ? styles.selected : ""}`}
                    onClick={() => toggleDietary(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.prefGroup}>
              <span className={styles.prefLabel}>Cuisine</span>
              <div className={styles.chips}>
                {PREFERENCE_OPTIONS.cuisine.map((c) => (
                  <button
                    key={c}
                    className={`${styles.prefChip} ${preferences.cuisine === c ? styles.selected : ""}`}
                    onClick={() => setPreferences((p) => ({ ...p, cuisine: p.cuisine === c ? "" : c }))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={loading || !ingredients.length}
            >
              {loading ? <Loader2 size={18} className={styles.spin} /> : <Search size={18} />}
              Find Recipes
            </button>
            <button
              className={styles.aiBtn}
              onClick={handleAIGenerate}
              disabled={aiLoading || !ingredients.length}
            >
              {aiLoading ? <Loader2 size={18} className={styles.spin} /> : <Sparkles size={18} />}
              {aiLoading ? "Creating..." : "AI Create Recipe"}
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {/* AI Recipe */}
      {aiRecipe && (
        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              <Sparkles size={20} /> Your Custom Recipe
            </h2>
            <button className={styles.regenerate} onClick={handleAIGenerate} disabled={aiLoading}>
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
          <RecipeCard recipe={aiRecipe} variant="ai" />
        </section>
      )}

      {/* Spoonacular Results */}
      {recipes.length > 0 && (
        <section className={styles.results}>
          <h2 className={styles.resultsTitle}>
            <Search size={20} /> Matched Recipes
            <span className={styles.count}>{recipes.length} found</span>
          </h2>
          <div className={styles.grid}>
            {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && !aiLoading && recipes.length === 0 && !aiRecipe && (
        <div className={styles.empty}>
          <span>🥘</span>
          <p>Add ingredients above and hit <strong>Find Recipes</strong> or let <strong>AI create</strong> something new.</p>
        </div>
      )}
    </main>
  );
}
