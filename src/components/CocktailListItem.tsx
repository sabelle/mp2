import type { Cocktail } from "../types/Cocktail";
import { saveNavigationList } from "../utils/navigation";


interface Props {
  cocktail: Cocktail;
  navigationList: Cocktail[];
  onOpen: () => void;
}


function CocktailListItem({
  cocktail,
  navigationList,
  onOpen,
}: Props) {
  function handleClick() {
    saveNavigationList(
      navigationList
    );

    onOpen();
  }


  return (
    <button
      type="button"
      className="list-item"
      onClick={handleClick}
    >
      <img
        src={cocktail.strDrinkThumb}
        alt={cocktail.strDrink}
      />

      <div className="list-item-info">
        <h2>
          {cocktail.strDrink}
        </h2>

        <p>
          {cocktail.strCategory ||
            "Unknown category"}
        </p>

        <span>
          {cocktail.strAlcoholic ||
            "Unknown"}
        </span>
      </div>

      <span className="arrow">
        →
      </span>
    </button>
  );
}


export default CocktailListItem;