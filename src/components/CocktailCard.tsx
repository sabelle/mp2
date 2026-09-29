import { Link } from "react-router-dom";
import type { Cocktail } from "../types/Cocktail";
import { saveNavigationList } from "../utils/navigation";

interface Props {
  cocktail: Cocktail;
  navigationList: Cocktail[];
}

function CocktailCard({
  cocktail,
  navigationList,
}: Props) {
  function handleClick() {
    saveNavigationList(navigationList);
  }

  return (
    <Link
      to={`/cocktails/${cocktail.idDrink}`}
      className="cocktail-card"
      onClick={handleClick}
    >
      <img
        src={`${cocktail.strDrinkThumb}/medium`}
        alt={cocktail.strDrink}
      />

      <div className="card-content">
        <h2>{cocktail.strDrink}</h2>
      </div>
    </Link>
  );
}

export default CocktailCard;