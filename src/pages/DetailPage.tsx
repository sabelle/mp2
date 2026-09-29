import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
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
  const location = useLocation();

  const [cocktail, setCocktail] =
    useState<Cocktail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [transitioning, setTransitioning] =
    useState(false);


  /* =========================================
     SEARCH CONTEXT
  ========================================= */

  const searchParams =
    new URLSearchParams(
      location.search
    );

  const searchQuery =
    searchParams.get("q") ?? "";


  /* =========================================
     LOAD COCKTAIL
  ========================================= */

  useEffect(() => {
    async function loadCocktail() {
      if (!id) {
        setError(
          "Cocktail not found."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        if (cocktail) {
          setTransitioning(true);
        }

        const result =
          await getCocktailById(id);

        if (!result) {
          setCocktail(null);

          setError(
            "Cocktail not found."
          );

          return;
        }

        if (cocktail) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                200
              )
          );
        }

        setCocktail(result);
        setTransitioning(false);
      } catch {
        setCocktail(null);

        setError(
          "Unable to load this cocktail."
        );

        setTransitioning(false);
      } finally {
        setLoading(false);
      }
    }

    loadCocktail();
  }, [id]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading && !cocktail) {
    return (
      <main className="page">
        <p className="status">
          Loading cocktail...
        </p>
      </main>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (error || !cocktail) {
    return (
      <main className="page">
        <div className="empty-state">
          <h1>
            Cocktail not found
          </h1>

          <p>
            {error ||
              "We couldn't find this cocktail."}
          </p>

          <Link
            to={{
              pathname: "/",
              search:
                location.search,
            }}
            className="back-link"
          >
            ← Back to search
          </Link>
        </div>
      </main>
    );
  }


  /* =========================================
     INGREDIENTS
  ========================================= */

  /*
   * CocktailDB stores ingredients as
   * strIngredient1, strIngredient2, etc.
   *
   * Convert those properties into an array
   * that is easier to display.
   */
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient =
      cocktail[
        `strIngredient${i}`
      ];

    const measure =
      cocktail[
        `strMeasure${i}`
      ];

    if (ingredient?.trim()) {
      ingredients.push({
        name:
          ingredient.trim(),

        measure:
          measure?.trim() ?? "",
      });
    }
  }


  /* =========================================
     PREVIOUS / NEXT
  ========================================= */

  /*
   * Get the IDs from the search results
   * or gallery that the user came from.
   */
  const navigationIds =
    getNavigationList();

  const currentIndex =
    navigationIds.indexOf(
      cocktail.idDrink
    );

  const previousId =
    currentIndex > 0
      ? navigationIds[
          currentIndex - 1
        ]
      : null;

  const nextId =
    currentIndex >= 0 &&
    currentIndex <
      navigationIds.length - 1
      ? navigationIds[
          currentIndex + 1
        ]
      : null;


  return (
    <main className="page">
      <Link
        to={{
          pathname: "/",
          search: location.search,
        }}
        className="back-link"
      >
        ← Back to search
      </Link>

      <div className="detail-context">
        {searchQuery && (
          <p className="detail-search-context">
            Results for{" "}
            <strong>
              "{searchQuery}"
            </strong>
          </p>
        )}
      </div>

      <div
        className={
          transitioning
            ? "detail-card transitioning"
            : "detail-card"
        }
      >
        <div className="detail-navigation">
          {previousId ? (
            <Link
              className="detail-nav-link"
              to={{
                pathname:
                  `/cocktails/${previousId}`,
                search:
                  location.search,
              }}
            >
              ← Previous
            </Link>
          ) : (
            <span className="detail-nav-link disabled">
              ← Previous
            </span>
          )}

          {nextId ? (
            <Link
              className="detail-nav-link"
              to={{
                pathname:
                  `/cocktails/${nextId}`,
                search:
                  location.search,
              }}
            >
              Next →
            </Link>
          ) : (
            <span className="detail-nav-link disabled">
              Next →
            </span>
          )}
        </div>

        <div className="detail-body">
          <img
            className="detail-image"
            src={
              cocktail.strDrinkThumb
            }
            alt={
              cocktail.strDrink
            }
          />

          <div className="detail-content">
            <div className="detail-tags">
              {cocktail.strCategory && (
                <span className="tag">
                  {
                    cocktail.strCategory
                  }
                </span>
              )}

              {cocktail.strAlcoholic && (
                <span className="tag">
                  {
                    cocktail.strAlcoholic
                  }
                </span>
              )}

              {cocktail.strIBA && (
                <span className="tag">
                  {
                    cocktail.strIBA
                  }
                </span>
              )}
            </div>

            <h1>
              {cocktail.strDrink}
            </h1>

            <p className="glass">
              Served in{" "}
              <strong>
                {cocktail.strGlass ||
                  "an unspecified glass"}
              </strong>
            </p>

            <section>
              <h2>
                Ingredients
              </h2>

              <ul className="ingredients">
                {ingredients.map(
                  (
                    ingredient,
                    index
                  ) => (
                    <li
                      key={`${ingredient.name}-${index}`}
                    >
                      <span>
                        {
                          ingredient.name
                        }
                      </span>

                      <span>
                        {
                          ingredient.measure
                        }
                      </span>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h2>
                Instructions
              </h2>

              <p className="instructions">
                {cocktail.strInstructions ||
                  "No instructions available."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}


export default DetailPage;