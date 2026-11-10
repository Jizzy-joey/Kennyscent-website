
import { Link } from "react-router-dom";
import "../App.css";

export default function Gloss() {
  return (
    <main className="gloss-page">
      <section className="gloss-hero">
        <p>K'S BEAUTY COLLECTION</p>
        <h1>K'S GLOSS</h1>
        <h2>A little shine. A lot of confidence.</h2>
        <p>
          Discover your perfect finishing touch with K'S GLOSS.
          Beauty, simplicity and confidence in every application.
        </p>
        <Link to="/contact" className="gloss-button">
          Shop K'S GLOSS
        </Link>
      </section>

      <section className="gloss-details">
        <h2>Beauty in Every Detail</h2>
        <p>
          Explore the K'S GLOSS collection and find a look
          that makes you feel confident.
        </p>
        <div className="gloss-placeholder">
          K'S GLOSS product images coming soon
        </div>
      </section>
    </main>
  );
}
