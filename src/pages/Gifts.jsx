
import { Link } from "react-router-dom";
import "../App.css";

export default function Gifts() {
  const collections = [
    {
      title: "Gift Hampers for Him",
      description:
        "Thoughtfully arranged gifts to celebrate the special men in your life.",
    },
    {
      title: "Gift Hampers for Her",
      description:
        "Beautiful gift combinations designed to make her feel appreciated.",
    },
  ];

  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">GIVE SOMETHING MEANINGFUL</p>
        <h1>Gift Hampers</h1>
        <p>
          Beautifully presented gifts for birthdays, anniversaries,
          celebrations and just because.
        </p>
      </section>

      <section className="page-section">
        <div className="service-grid">
          {collections.map((item) => (
            <article className="service-card" key={item.title}>
              <div className="service-image">Gift image coming soon</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Link to="/contact" className="gold-button">
                Order a Hamper
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
