import { Heart, Trash2 } from "lucide-react";
import { useRecipeStore } from "../store/recipeStore";
import RecipeCard from "../components/RecipeCard";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const { favorites } = useRecipeStore();

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <Heart size={24} />
          <div>
            <h1>Saved Recipes</h1>
            <p>{favorites.length} recipe{favorites.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className={styles.empty}>
            <span>💛</span>
            <p>No favorites yet — search for recipes and save the ones you love.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((fav) => (
              <RecipeCard
                key={fav.id}
                recipe={fav.recipe}
                variant={fav.recipe.instructions ? "ai" : "spoonacular"}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
