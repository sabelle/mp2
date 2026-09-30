import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Dropdown from "../components/Dropdown";
import PageHeader from "../components/PageHeader";
import CocktailListItem from "../components/CocktailListItem";
import CocktailCard from "../components/CocktailCard";

import {
  getRandomCocktail,
  searchCocktails,
} from "../services/cocktailApi";

import {
  COCKTAIL_CATEGORIES,
  type Cocktail,
} from "../types/Cocktail";


type SortProperty = "name" | "category";
type SortOrder = "asc" | "desc";
type ViewMode = "list" | "gallery";


function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
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

  const [randomCocktails, setRandomCocktails] =
    useState<Cocktail[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [randomLoading, setRandomLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [transitioning, setTransitioning] =
    useState(false);

  const [pageTransitioning, setPageTransitioning] =
    useState(false);


  /* Read search, sort, filter, and view settings from the URL. */

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

  const selectedAlcoholic =
    searchParams.get("alcoholic") ?? "";

  const viewMode: ViewMode =
    searchParams.get("view") === "gallery"
      ? "gallery"
      : "list";


  /* Update one or more settings in the URL. */

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
      { replace: true }
    );
  }


  /* Fade results before changing a sort, filter, or view setting. */

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


  /* Fade the page before opening a cocktail. */

  async function openCocktail(
    cocktail: Cocktail
  ) {
    setPageTransitioning(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    const search =
      searchParams.toString();

    navigate({
      pathname:
        `/cocktails/${cocktail.idDrink}`,
      search:
        search
          ? `?${search}`
          : "",
    });
  }


  /* Load and save six random cocktails for the home page. */

  useEffect(() => {
    async function loadRandomCocktails() {
      const stored =
        sessionStorage.getItem(
          "randomCocktails"
        );

      if (stored) {
        try {
          const savedCocktails =
            JSON.parse(stored) as Cocktail[];

          setRandomCocktails(
            savedCocktails
          );

          setRandomLoading(false);
          return;
        } catch {
          sessionStorage.removeItem(
            "randomCocktails"
          );
        }
      }

      try {
        setRandomLoading(true);

        const requests =
          Array.from(
            { length: 6 },
            () => getRandomCocktail()
          );

        const results =
          await Promise.all(requests);

        const validCocktails =
          results.filter(
            (cocktail): cocktail is Cocktail =>
              cocktail !== null
          );

        const uniqueCocktails =
          Array.from(
            new Map(
              validCocktails.map(
                (cocktail) => [
                  cocktail.idDrink,
                  cocktail,
                ]
              )
            ).values()
          );

        setRandomCocktails(
          uniqueCocktails
        );

        sessionStorage.setItem(
          "randomCocktails",
          JSON.stringify(uniqueCocktails)
        );
      } catch {
        setError(
          "Unable to load cocktail suggestions."
        );
      } finally {
        setRandomLoading(false);
      }
    }

    loadRandomCocktails();
  }, []);


  /* Search for cocktails after the user stops typing for 300ms. */

  useEffect(() => {
    if (!query.trim()) {
      setCocktails([]);
      setLoading(false);
      return;
    }

    const timeoutId =
      window.setTimeout(async () => {
        try {
          setLoading(true);
          setError("");

          const results = await searchCocktails(query);

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




  /* Show search results when searching, otherwise show random drinks. */

  const sourceCocktails =
    query.trim()
      ? cocktails
      : randomCocktails;


  /* Apply the selected filters and sorting. */

  const displayedCocktails =
    useMemo(() => {
      const filtered =
        sourceCocktails.filter(
          (cocktail) => {
            const matchesCategory =
              !selectedCategory ||
              cocktail.strCategory ===
                selectedCategory;

            const matchesAlcoholic =
              !selectedAlcoholic ||
              cocktail.strAlcoholic ===
                selectedAlcoholic;

            return (
              matchesCategory &&
              matchesAlcoholic
            );
          }
        );

      return [...filtered].sort(
        (a, b) => {
          const direction =
            sortOrder === "asc"
              ? 1
              : -1;

          const nameComparison =
            a.strDrink.localeCompare(
              b.strDrink
            );

          if (sortProperty === "name") {
            return (
              nameComparison *
              direction
            );
          }

          /* Sort by category first, then cocktail name. */

          const categoryComparison =
            (
              a.strCategory ?? ""
            ).localeCompare(
              b.strCategory ?? ""
            );

          if (categoryComparison !== 0) {
            return (
              categoryComparison *
              direction
            );
          }

          return (
            nameComparison *
            direction
          );
        }
      );
    }, [
      sourceCocktails,
      selectedCategory,
      selectedAlcoholic,
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


  const resultsLoading =
    query.trim()
      ? loading
      : randomLoading;


  return (
    <main
      className={
        pageTransitioning
          ? "page page-transitioning"
          : "page"
      }
    >
      <PageHeader />

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

            <Dropdown
            id="sort-property"
            value={sortProperty}
            options={[
                {
                value: "name",
                label: "Name",
                },
                {
                value: "category",
                label: "Category",
                },
            ]}
            onChange={(value) =>
                transitionSearchParams({
                sort: value,
                })
            }
            />
        </div>


        <div className="control-group">
            <label htmlFor="category-filter">
            Filter by:
            </label>

            <Dropdown
            id="category-filter"
            value={selectedCategory}
            options={[
                {
                value: "",
                label: "All categories",
                },
                ...COCKTAIL_CATEGORIES.map(
                (category) => ({
                    value: category,
                    label: category,
                })
                ),
            ]}
            onChange={(value) =>
                transitionSearchParams({
                category: value,
                })
            }
            />
        </div>


        <div className="control-group">
            <label htmlFor="alcoholic-filter">
            Type:
            </label>

            <Dropdown
            id="alcoholic-filter"
            value={selectedAlcoholic}
            options={[
                {
                value: "",
                label: "All types",
                },
                {
                value: "Alcoholic",
                label: "Alcoholic",
                },
                {
                value: "Non alcoholic",
                label: "Non alcoholic",
                },
            ]}
            onChange={(value) =>
                transitionSearchParams({
                alcoholic: value,
                })
            }
            />
        </div>
      </div>

      <div
        className={
          transitioning
            ? "results-area transitioning"
            : "results-area"
        }
      >
        {resultsLoading && (
          <p className="status">
            {query.trim()
              ? "Searching cocktails..."
              : "Finding cocktails for you..."}
          </p>
        )}

        {error && (
          <p className="status error">
            {error}
          </p>
        )}

        {!resultsLoading &&
          !error &&
          displayedCocktails.length > 0 && (
            <>
              {query.trim() ? (
                <p className="result-count">
                  {displayedCocktails.length}{" "}
                  {displayedCocktails.length === 1
                    ? "cocktail"
                    : "cocktails"}{" "}
                  found
                </p>
              ) : (
                <p className="result-count">
                  Explore these cocktails
                </p>
              )}

              {viewMode === "list" ? (
                <div className="cocktail-list">
                  {displayedCocktails.map(
                    (cocktail) => (
                      <CocktailListItem
                        key={cocktail.idDrink}
                        cocktail={cocktail}
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
                        key={cocktail.idDrink}
                        cocktail={cocktail}
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

        {!resultsLoading &&
          !error &&
          displayedCocktails.length === 0 && (
            <div className="empty-state">
              <h2>
                No cocktails found
              </h2>

              <p>
                {query.trim()
                  ? "Try a different search or filter."
                  : "Try changing your filters."}
              </p>
            </div>
          )}
      </div>
    </main>
  );
}


export default ListPage;