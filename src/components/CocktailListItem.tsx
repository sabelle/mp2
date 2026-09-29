import { Link } from "react-router-dom";
import type { Cocktail } from "../types/Cocktail";
import { saveNavigationList } from "../utils/navigation";

interface Props {
  cocktail: Cocktail;
  navigationList: Cocktail[];
}

function CocktailListItem({
  cocktail,
  navigationList,
}: Props) {
  function handleClick() {
    saveNavigationList(navigationList);
  }

  return (
    <Link
      to={`/cocktails/${cocktail.idDrink}`}
      className="list-item"
      onClick={handleClick}
    >
      <img
        src={`${cocktail.strDrinkThumb}/small`}
        alt={cocktail.strDrink}
      />

      <div className="list-item-info">
        <h2>{cocktail.strDrink}</h2>

        <p>
          {cocktail.strCategory || "Unknown category"}
        </p>

        <span>
          {cocktail.strAlcoholic || "Unknown"}
        </span>
      </div>

      <span className="arrow">→</span>
    </Link>
  );
}

export default CocktailListItem;