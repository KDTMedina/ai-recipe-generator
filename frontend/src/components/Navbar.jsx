import { Link, useLocation } from "react-router-dom";
import { ChefHat, Heart, Sparkles } from "lucide-react";
import { useRecipeStore } from "../store/recipeStore";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const favorites = useRecipeStore((s) => s.favorites);

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <ChefHat size={22} />
          <span>Mise<em>en</em>Place</span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
            <Sparkles size={16} /> Generate
          </Link>
          <Link to="/favorites" className={`${styles.link} ${pathname === "/favorites" ? styles.active : ""}`}>
            <Heart size={16} />
            Favorites
            {favorites.length > 0 && <span className={styles.badge}>{favorites.length}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
