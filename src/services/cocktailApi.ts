import axios from "axios";

import {
  COCKTAIL_CATEGORIES,
  type Cocktail,
} from "../types/Cocktail";


const API_URL =
  "https://www.thecocktaildb.com/api/json/v1/1";


interface DrinksResponse {
  drinks: Cocktail[] | null;
}


interface FilteredDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}


interface FilterResponse {
  drinks: FilteredDrink[] | null;
}


/* Check whether the search matches a category word. */

function categoryMatchesSearch(
  category: string,
  query: string
): boolean {
  const normalizedCategory =
    category.toLowerCase();

  const normalizedQuery =
    query.toLowerCase();

  if (
    normalizedCategory ===
    normalizedQuery
  ) {
    return true;
  }

  const categoryWords =
    normalizedCategory.split(
      /[\s/]+/
    );

  return categoryWords.includes(
    normalizedQuery
  );
}


/* Search cocktail names and matching categories. */

export async function searchCocktails(
  query: string
): Promise<Cocktail[]> {
  const trimmedQuery =
    query.trim();

  if (!trimmedQuery) {
    return [];
  }


  /* Search cocktail names. */

  const nameResponse =
    await axios.get<DrinksResponse>(
      `${API_URL}/search.php`,
      {
        params: {
          s: trimmedQuery,
        },
      }
    );

  const nameMatches =
    nameResponse.data.drinks ?? [];


  /* Find categories matching the search. */

  const matchingCategories =
    COCKTAIL_CATEGORIES.filter(
      (category) =>
        categoryMatchesSearch(
          category,
          trimmedQuery
        )
    );


  if (
    matchingCategories.length === 0
  ) {
    return nameMatches;
  }


  /* Get drinks from matching categories. */

  const categoryResults =
    await Promise.all(
      matchingCategories.map(
        async (category) => {
          const response =
            await axios.get<FilterResponse>(
              `${API_URL}/filter.php`,
              {
                params: {
                  c: category,
                },
              }
            );

          return (
            response.data.drinks ?? []
          ).map(
            (cocktail) => ({
              ...cocktail,
              strCategory: category,
            })
          );
        }
      )
    );

  const categoryMatches =
    categoryResults.flat();


  /* Combine results and remove duplicates. */

  const combined =
    new Map<string, Cocktail>();

  nameMatches.forEach(
    (cocktail) => {
      combined.set(
        cocktail.idDrink,
        cocktail
      );
    }
  );

  categoryMatches.forEach(
    (cocktail) => {
      if (
        !combined.has(
          cocktail.idDrink
        )
      ) {
        combined.set(
          cocktail.idDrink,
          cocktail
        );
      }
    }
  );

  return Array.from(
    combined.values()
  );
}


/* Get full details for one cocktail. */

export async function getCocktailById(
  id: string
): Promise<Cocktail | null> {
  const response =
    await axios.get<DrinksResponse>(
      `${API_URL}/lookup.php`,
      {
        params: {
          i: id,
        },
      }
    );

  return response.data.drinks?.[0] ?? null;
}


/* Get one random cocktail. */

export async function getRandomCocktail():
Promise<Cocktail | null> {
  const response =
    await axios.get<DrinksResponse>(
      `${API_URL}/random.php`
    );

  return response.data.drinks?.[0] ?? null;
}