import axios from "axios";
import type { Cocktail } from "../types/Cocktail";

const API_URL =
  "https://www.thecocktaildb.com/api/json/v1/1";


interface DrinksResponse {
  drinks: Cocktail[] | null;
}


interface CategoryResponse {
  drinks: {
    strCategory: string;
  }[];
}


export async function searchCocktails(
  query: string
): Promise<Cocktail[]> {
  if (!query.trim()) {
    return [];
  }

  const response =
    await axios.get<DrinksResponse>(
      `${API_URL}/search.php`,
      {
        params: {
          s: query,
        },
      }
    );

  return response.data.drinks ?? [];
}


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


export async function getCategories():
Promise<string[]> {
  const response =
    await axios.get<CategoryResponse>(
      `${API_URL}/list.php`,
      {
        params: {
          c: "list",
        },
      }
    );

  return response.data.drinks.map(
    (category) =>
      category.strCategory
  );
}


export async function getRandomCocktail():
Promise<Cocktail | null> {
  const response =
    await axios.get<DrinksResponse>(
      `${API_URL}/random.php`
    );

  return response.data.drinks?.[0] ?? null;
}