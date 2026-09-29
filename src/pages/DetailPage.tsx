import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { getCocktailById } from "../services/cocktailApi";
import { getNavigationList } from "../utils/navigation";
import type { Cocktail } from "../types/Cocktail";

interface Ingredient {
  name: string;
  measure: string;
}

function DetailPage() {
  const { id } = useParams();

  const [cocktail, setCocktail] =
    useState<Cocktail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load the cocktail whenever the ID in the URL
   * changes.
   */
  useEffect(() => {
    async function loadCocktail() {
      if (!id) {
        setError("Cocktail not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getCocktailById(id);

        if (!result) {
          setCocktail(null);
          setError("Cocktail not found.");
          return;
        }

        setCocktail(result);
      } catch {
        setCocktail(null);

        setError(
          "Unable to load this cocktail."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCocktail();
  }, [id]);

  if (loading) {
    return (
      <p className="status">
        Loading cocktail...
      </p>
    );
  }

  if (error || !cocktail) {
    return (
      <main className="page">
        <div className="empty-state">
          <h1>Cocktail not found</h1>

          <p>
            {error ||
              "We couldn't find this cocktail."}
          </p>

          <Link
            to="/"
            className="navigation-button"
          >
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  /*
   * The API stores ingredients as strIngredient1,
   * strIngredient2, etc. Build an easier array from
   * those properties.
   */
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient =
      cocktail[`strIngredient${i}`];

    const measure =
      cocktail[`strMeasure${i}`];

    if (ingredient?.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() ?? "",
      });
    }
  }

  /*
   * Find this cocktail inside the collection that
   * the user originally clicked from.
   */
  const navigationIds = getNavigationList();

  const currentIndex =
    navigationIds.indexOf(cocktail.idDrink);

  const previousId =
    currentIndex > 0
      ? navigationIds[currentIndex - 1]
      : null;

  const nextId =
    currentIndex >= 0 &&
    currentIndex < navigationIds.length - 1
      ? navigationIds[currentIndex + 1]
      : null;

  return (
    <main className="page">
      <Link to="/" className="back-link">
        ← Back to search
      </Link>

      <div className="detail-card">
        <img
          className="detail-image"
          src={`${cocktail.strDrinkThumb}/large`}
          alt={cocktail.strDrink}
        />

        <div className="detail-content">
          <div className="detail-tags">
            {cocktail.strCategory && (
              <span className="tag">
                {cocktail.strCategory}
              </span>
            )}

            {cocktail.strAlcoholic && (
              <span className="tag">
                {cocktail.strAlcoholic}
              </span>
            )}

            {cocktail.strIBA && (
              <span className="tag">
                {cocktail.strIBA}
              </span>
            )}
          </div>

          <h1>{cocktail.strDrink}</h1>

          <p className="glass">
            Served in{" "}
            <strong>
              {cocktail.strGlass ||
                "an unspecified glass"}
            </strong>
          </p>

          <section>
            <h2>Ingredients</h2>

            <ul className="ingredients">
              {ingredients.map(
                (ingredient, index) => (
                  <li
                    key={`${ingredient.name}-${index}`}
                  >
                    <span>
                      {ingredient.name}
                    </span>

                    <span>
                      {ingredient.measure}
                    </span>
                  </li>
                )
              )}
            </ul>
          </section>

          <section>
            <h2>Instructions</h2>

            <p className="instructions">
              {cocktail.strInstructions ||
                "No instructions available."}
            </p>
          </section>
        </div>
      </div>

      <div className="detail-navigation">
        {previousId ? (
          <Link
            className="navigation-button"
            to={`/cocktails/${previousId}`}
          >
            ← Previous
          </Link>
        ) : (
          <button
            className="navigation-button disabled"
            disabled
          >
            ← Previous
          </button>
        )}

        {nextId ? (
          <Link
            className="navigation-button"
            to={`/cocktails/${nextId}`}
          >
            Next →
          </Link>
        ) : (
          <button
            className="navigation-button disabled"
            disabled
          >
            Next →
          </button>
        )}
      </div>
    </main>
  );
}

export default DetailPage;