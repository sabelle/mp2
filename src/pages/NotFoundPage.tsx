import { Link } from "react-router-dom";


function NotFoundPage() {
  return (
    <main className="page">
      <div className="empty-state">
        <p className="page-label">
          404
        </p>

        <h1>
          Page not found
        </h1>

        <p>
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Cocktail Explorer
        </Link>
      </div>
    </main>
  );
}


export default NotFoundPage;