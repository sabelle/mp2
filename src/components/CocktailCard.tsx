import type { Cocktail } from "../types/Cocktail";
import { saveNavigationList } from "../utils/navigation";


interface Props {
  cocktail: Cocktail;
  navigationList: Cocktail[];
  onOpen: () => void;
}


function CocktailCard({
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
      className="cocktail-card"
      onClick={handleClick}
    >
      <img
        src={cocktail.strDrinkThumb}
        alt={cocktail.strDrink}
      />

      <div className="card-content">
        <h2>
          {cocktail.strDrink}
        </h2>
      </div>
    </button>
  );
}


export default CocktailCard;