import { Link } from "react-router-dom";


function PageHeader() {
  return (
    <div className="page-header">
      <p className="page-label">
        Discover your next drink
      </p>

      <h1>
        <Link
          to="/"
          className="home-link"
        >
          Cocktail Explorer
        </Link>
      </h1>

      <p className="subtitle">
        Search, sort, and browse cocktail
        recipes from around the world.
      </p>
    </div>
  );
}


export default PageHeader;