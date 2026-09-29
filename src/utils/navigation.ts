import type { Cocktail } from "../types/Cocktail";

const STORAGE_KEY = "cocktailNavigation";

/**
 * Saves the current collection of cocktails so the detail
 * page can navigate through the same collection.
 */
export function saveNavigationList(
  cocktails: Cocktail[]
): void {
  const ids = cocktails.map(
    (cocktail) => cocktail.idDrink
  );

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ids)
  );
}

/**
 * Retrieves the saved cocktail IDs.
 */
export function getNavigationList(): string[] {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}