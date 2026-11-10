
import { Link } from "react-router-dom";
import "../App.css";

export default function Surprises() {
  const services = [
    {
      title: "Surprises for Boys",
      description: "Special surprise packages designed for him.",
    },
    {
      title: "Surprises for Girls",
      description: "Thoughtful and beautiful surprises designed for her.",
    },
    {
      title: "Birthday Surprise Setups",
      description: "Celebrate birthdays with memorable surprise arrangements.",
    },
    {
      title: "Event Decoration",
      description: "Beautiful decorations for your special occasions.",
    },
  ];

  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">MAKE THEIR DAY UNFORGETTABLE</p>
        <h1>Surprise Packages & Setups</h1>
        <p>
          We help turn your ideas into memorable experiences.
        </p>
      </section>

      <section className="page-section">
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-image">Service image coming soon</div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <Link to="/contact" className="gold-button">
                Book Now
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
