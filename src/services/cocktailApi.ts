import axios from "axios";
import type { Cocktail } from "../types/Cocktail";

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

interface DrinksResponse {
  drinks: Cocktail[] | null;
}

interface CategoryResponse {
  drinks: {
    strCategory: string;
  }[];
}

/**
 * Searches for cocktails by name.
 */
export async function searchCocktails(
  query: string
): Promise<Cocktail[]> {
  if (!query.trim()) {
    return [];
  }

  const response = await axios.get<DrinksResponse>(
    `${API_URL}/search.php`,
    {
      params: {
        s: query,
      },
    }
  );

  return response.data.drinks ?? [];
}

/**
 * Gets the complete information for one cocktail.
 */
export async function getCocktailById(
  id: string
): Promise<Cocktail | null> {
  const response = await axios.get<DrinksResponse>(
    `${API_URL}/lookup.php`,
    {
      params: {
        i: id,
      },
    }
  );

  return response.data.drinks?.[0] ?? null;
}

/**
 * Gets all available cocktail categories.
 */
export async function getCategories(): Promise<string[]> {
  const response = await axios.get<CategoryResponse>(
    `${API_URL}/list.php`,
    {
      params: {
        c: "list",
      },
    }
  );

  return response.data.drinks.map(
    (category) => category.strCategory
  );
}

/**
 * Gets cocktails belonging to a particular category.
 */
export async function getCocktailsByCategory(
  category: string
): Promise<Cocktail[]> {
  const response = await axios.get<DrinksResponse>(
    `${API_URL}/filter.php`,
    {
      params: {
        c: category,
      },
    }
  );

  return response.data.drinks ?? [];
}