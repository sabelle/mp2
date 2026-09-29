import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CocktailListItem from "../components/CocktailListItem";
import CocktailCard from "../components/CocktailCard";

import {
  getCategories,
  searchCocktails,
} from "../services/cocktailApi";

import type { Cocktail } from "../types/Cocktail";


type SortProperty = "name" | "category";
type SortOrder = "asc" | "desc";
type ViewMode = "list" | "gallery";


function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}


function UpArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 19V5M6 11l6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function DownArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M6 13l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ListPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const [cocktails, setCocktails] =
    useState<Cocktail[]>([]);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [transitioning, setTransitioning] =
    useState(false);

  const [pageTransitioning, setPageTransitioning] =
    useState(false);


  /* =========================================
     SEARCH STATE
  ========================================= */

  const query =
    searchParams.get("q") ?? "";

  const sortProperty: SortProperty =
    searchParams.get("sort") === "category"
      ? "category"
      : "name";

  const sortOrder: SortOrder =
    searchParams.get("order") === "desc"
      ? "desc"
      : "asc";

  const selectedCategory =
    searchParams.get("category") ?? "";

  const viewMode: ViewMode =
    searchParams.get("view") === "gallery"
      ? "gallery"
      : "list";


  /* =========================================
     UPDATE SEARCH STATE
  ========================================= */

  function updateSearchParams(
    updates: Record<string, string>
  ) {
    const newParams =
      new URLSearchParams(searchParams);

    Object.entries(updates).forEach(
      ([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      }
    );

    setSearchParams(
      newParams,
      {
        replace: true,
      }
    );
  }


  /* =========================================
     TRANSITION SEARCH STATE
  ========================================= */

  async function transitionSearchParams(
    updates: Record<string, string>
  ) {
    setTransitioning(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    updateSearchParams(updates);

    setTransitioning(false);
  }


  /* =========================================
     DETAIL NAVIGATION
  ========================================= */

  async function openCocktail(
    cocktail: Cocktail
  ) {
    setPageTransitioning(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    navigate({
      pathname:
        `/cocktails/${cocktail.idDrink}`,
      search:
        searchParams.toString(),
    });
  }


  /* =========================================
     SEARCH
  ========================================= */

  useEffect(() => {
    if (!query.trim()) {
      setCocktails([]);
      setLoading(false);
      setError("");

      return;
    }

    const timeoutId =
      window.setTimeout(async () => {
        try {
          setLoading(true);
          setError("");

          const results =
            await searchCocktails(query);

          setCocktails(results);
        } catch {
          setCocktails([]);

          setError(
            "Unable to search for cocktails. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);


  /* =========================================
     LOAD CATEGORIES
  ========================================= */

  useEffect(() => {
    async function loadCategories() {
      try {
        const results =
          await getCategories();

        setCategories(results);
      } catch {
        setError(
          "Unable to load cocktail categories."
        );
      }
    }

    loadCategories();
  }, []);


  /* =========================================
     FILTER + SORT
  ========================================= */

  const displayedCocktails =
    useMemo(() => {
      const filtered =
        selectedCategory
          ? cocktails.filter(
              (cocktail) =>
                cocktail.strCategory ===
                selectedCategory
            )
          : cocktails;

      return [...filtered].sort(
        (a, b) => {
          let first: string;
          let second: string;

          if (sortProperty === "name") {
            first = a.strDrink;
            second = b.strDrink;
          } else {
            first =
              a.strCategory ?? "";

            second =
              b.strCategory ?? "";
          }

          const comparison =
            first.localeCompare(second);

          return sortOrder === "asc"
            ? comparison
            : -comparison;
        }
      );
    }, [
      cocktails,
      selectedCategory,
      sortProperty,
      sortOrder,
    ]);


  function toggleSortOrder() {
    transitionSearchParams({
      order:
        sortOrder === "asc"
          ? "desc"
          : "asc",
    });
  }


  return (
    <main
      className={
        pageTransitioning
          ? "page page-transitioning"
          : "page"
      }
    >
      <div className="page-header">
        <p className="eyebrow">
          Discover your next drink
        </p>

        <h1>
          Cocktail Explorer
        </h1>

        <p className="subtitle">
          Search, sort, and browse cocktail
          recipes from around the world.
        </p>
      </div>


      <div className="toolbar-primary">
        <input
          className="search-input"
          type="search"
          placeholder="Search cocktails..."
          value={query}
          onChange={(event) =>
            updateSearchParams({
              q: event.target.value,
            })
          }
        />

        <button
          className="icon-button"
          type="button"
          onClick={toggleSortOrder}
          aria-label={
            sortOrder === "asc"
              ? "Currently ascending. Click to sort descending."
              : "Currently descending. Click to sort ascending."
          }
          title={
            sortOrder === "asc"
              ? "Ascending"
              : "Descending"
          }
        >
          {sortOrder === "asc" ? (
            <UpArrowIcon />
          ) : (
            <DownArrowIcon />
          )}
        </button>

        <div
          className="view-toggle"
          aria-label="Choose view"
        >
          <button
            type="button"
            className={
              viewMode === "list"
                ? "view-button active"
                : "view-button"
            }
            onClick={() =>
              transitionSearchParams({
                view: "list",
              })
            }
            aria-label="List view"
            title="List view"
          >
            <ListIcon />
          </button>

          <button
            type="button"
            className={
              viewMode === "gallery"
                ? "view-button active"
                : "view-button"
            }
            onClick={() =>
              transitionSearchParams({
                view: "gallery",
              })
            }
            aria-label="Gallery view"
            title="Gallery view"
          >
            <GridIcon />
          </button>
        </div>
      </div>


      <div className="toolbar-secondary">
        <div className="control-group">
          <label htmlFor="sort-property">
            Sort by:
          </label>

          <select
            id="sort-property"
            value={sortProperty}
            onChange={(event) =>
              transitionSearchParams({
                sort:
                  event.target.value,
              })
            }
          >
            <option value="name">
              Name
            </option>

            <option value="category">
              Category
            </option>
          </select>
        </div>


        <div className="control-group">
          <label htmlFor="category-filter">
            Filter by:
          </label>

          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) =>
              transitionSearchParams({
                category:
                  event.target.value,
              })
            }
          >
            <option value="">
              All categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </div>


      <div
        className={
          transitioning
            ? "results-area transitioning"
            : "results-area"
        }
      >
        {!query.trim() && (
          <div className="empty-state">
            <h2>
              Search for a cocktail
            </h2>

            <p>
              Start typing a cocktail
              name above to see matching
              drinks.
            </p>
          </div>
        )}


        {loading && query.trim() && (
          <p className="status">
            Searching cocktails...
          </p>
        )}


        {error && (
          <p className="status error">
            {error}
          </p>
        )}


        {!loading &&
          !error &&
          query.trim() &&
          displayedCocktails.length >
            0 && (
            <>
              <p className="result-count">
                {
                  displayedCocktails.length
                }{" "}
                {displayedCocktails.length ===
                1
                  ? "cocktail"
                  : "cocktails"}{" "}
                found
              </p>

              {viewMode === "list" ? (
                <div className="cocktail-list">
                  {displayedCocktails.map(
                    (cocktail) => (
                      <CocktailListItem
                        key={
                          cocktail.idDrink
                        }
                        cocktail={
                          cocktail
                        }
                        navigationList={
                          displayedCocktails
                        }
                        onOpen={() =>
                          openCocktail(
                            cocktail
                          )
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="gallery">
                  {displayedCocktails.map(
                    (cocktail) => (
                      <CocktailCard
                        key={
                          cocktail.idDrink
                        }
                        cocktail={
                          cocktail
                        }
                        navigationList={
                          displayedCocktails
                        }
                        onOpen={() =>
                          openCocktail(
                            cocktail
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}


        {!loading &&
          !error &&
          query.trim() &&
          displayedCocktails.length ===
            0 && (
            <div className="empty-state">
              <h2>
                No cocktails found
              </h2>

              <p>
                Try a different search
                or category.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}


export default ListPage;