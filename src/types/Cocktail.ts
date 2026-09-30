export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate?: string | null;
  strTags?: string | null;
  strCategory?: string | null;
  strIBA?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;
  strDrinkThumb: string;

  [key: `strIngredient${number}`]:
    string | null | undefined;

  [key: `strMeasure${number}`]:
    string | null | undefined;
}


export const COCKTAIL_CATEGORIES = [
  "Beer",
  "Cocktail",
  "Cocoa",
  "Coffee / Tea",
  "Homemade Liqueur",
  "Ordinary Drink",
  "Other / Unknown",
  "Punch / Party Drink",
  "Shake",
  "Shot",
  "Soft Drink / Soda",
] as const;