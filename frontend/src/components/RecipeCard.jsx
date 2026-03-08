import { Heart, Clock, Users, ExternalLink } from "lucide-react";
import { useRecipeStore } from "../store/recipeStore";
import toast from "react-hot-toast";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ recipe, variant = "spoonacular" }) {
  const { addFavorite, removeFavorite, isFavorite } = useRecipeStore();
  const id = recipe.id || recipe.name;
  const favorited = isFavorite(id);

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite(id);
      toast("Removed from favorites");
    } else {
      addFavorite(recipe);
      toast.success("Saved to favorites!");
    }
  };

  if (variant === "ai") {
    return <AIRecipeCard recipe={recipe} favorited={favorited} onFavorite={handleFavorite} />;
  }

  return (
    <div className={styles.card}>
      {recipe.image && (
        <div className={styles.imgWrap}>
          <img src={recipe.image} alt={recipe.title} loading="lazy" />
          <button
            className={`${styles.heartBtn} ${favorited ? styles.active : ""}`}
            onClick={handleFavorite}
            aria-label="Toggle favorite"
          >
            <Heart size={16} fill={favorited ? "currentColor" : "none"} />
          </button>
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{recipe.title}</h3>

        <div className={styles.meta}>
          {recipe.readyInMinutes && (
            <span><Clock size={13} /> {recipe.readyInMinutes}m</span>
          )}
          {recipe.servings && (
            <span><Users size={13} /> {recipe.servings}</span>
          )}
        </div>

        {recipe.usedIngredientCount !== undefined && (
          <div className={styles.matchBar}>
            <div
              className={styles.matchFill}
              style={{
                width: `${Math.round((recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)) * 100)}%`
              }}
            />
            <span>{recipe.usedIngredientCount} of {recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients matched</span>
          </div>
        )}

        {/*{recipe.sourceUrl && (
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
            View Full Recipe <ExternalLink size={13} />
          </a>
        )}*/}

        <a href={`https://spoonacular.com/recipes/${recipe.title?.toLowerCase().replace(/\s+/g, "-")}-${recipe.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLink}
        >
          View Full Recipe <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

function AIRecipeCard({ recipe, favorited, onFavorite }) {
  return (
    <div className={`${styles.card} ${styles.aiCard}`}>
      <div className={styles.aiHeader}>
        <div>
          <span className={styles.aiBadge}>✦ AI Generated</span>
          <h3 className={styles.title}>{recipe.name}</h3>
          <p className={styles.desc}>{recipe.description}</p>
        </div>
        <button
          className={`${styles.heartBtn} ${styles.heartAbsolute} ${favorited ? styles.active : ""}`}
          onClick={onFavorite}
        >
          <Heart size={16} fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>

      <div className={styles.aiMeta}>
        {[
          { label: "Prep", value: recipe.prepTime },
          { label: "Cook", value: recipe.cookTime },
          { label: "Serves", value: recipe.servings },
          { label: "Level", value: recipe.difficulty },
        ].map(({ label, value }) => value && (
          <div key={label} className={styles.metaItem}>
            <span className={styles.metaLabel}>{label}</span>
            <span className={styles.metaValue}>{value}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h4>Ingredients</h4>
        <ul className={styles.ingredientList}>
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}><span className={styles.amount}>{ing.amount}</span> {ing.item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h4>Instructions</h4>
        <ol className={styles.steps}>
          {recipe.instructions?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.tips && (
        <div className={styles.tip}>
          <span>💡</span> {recipe.tips}
        </div>
      )}
    </div>
  );
}
