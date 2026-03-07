import { useState } from "react";
import { Plus, X, ChefHat } from "lucide-react";
import { useRecipeStore } from "../store/recipeStore";
import styles from "./IngredientInput.module.css";

const SUGGESTIONS = ["chicken", "garlic", "onion", "tomatoes", "pasta", "rice", "eggs", "spinach", "lemon", "butter"];

export default function IngredientInput() {
  const [value, setValue] = useState("");
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useRecipeStore();

  const handleAdd = () => {
    if (value.trim()) {
      addIngredient(value);
      setValue("");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add an ingredient..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className={styles.addBtn} onClick={handleAdd} disabled={!value.trim()}>
          <Plus size={18} />
        </button>
      </div>

      {/* Quick suggestions */}
      {ingredients.length === 0 && (
        <div className={styles.suggestions}>
          <span className={styles.suggestLabel}>Try:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} className={styles.chip} onClick={() => addIngredient(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Ingredient tags */}
      {ingredients.length > 0 && (
        <div className={styles.tags}>
          {ingredients.map((ing) => (
            <span key={ing} className={styles.tag}>
              {ing}
              <button onClick={() => removeIngredient(ing)} aria-label={`Remove ${ing}`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button className={styles.clearAll} onClick={clearIngredients}>
            Clear all
          </button>
        </div>
      )}

      {ingredients.length > 0 && (
        <p className={styles.count}>
          <ChefHat size={14} />
          {ingredients.length} ingredient{ingredients.length > 1 ? "s" : ""} ready
        </p>
      )}
    </div>
  );
}
