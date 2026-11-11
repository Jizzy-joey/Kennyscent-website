
import { useState } from "react";
import { Link } from "react-router-dom";
import { designerPerfumes, regularPerfumes, formatPrice } from "../data/perfumes";
import { ArrowRight } from "lucide-react";
import "./Perfumes.css";

function Perfumes() {
  const [activeCategory, setActiveCategory] = useState("designer");

  const perfumes =
    activeCategory === "designer"
      ? designerPerfumes
      : regularPerfumes;

  const handleEnquiry = (perfume) => {
    // Replace this with your real WhatsApp number.
    const whatsappNumber = "YOUR_WHATSAPP_NUMBER";

    const message = encodeURIComponent(
      `Hello Kennyscent, I am interested in ${perfume.name}. Please provide more information.`
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="perfumes-page">
      <section className="perfume-hero">
        <div className="perfume-hero-overlay">
          <div className="perfume-hero-content">
            <span className="perfume-eyebrow">
              KENNYSCENT COLLECTION
            </span>

            <h1>Find Your Signature Scent</h1>

            <p>
              Discover fragrances that leave a lasting impression.
              Explore our carefully selected collection of everyday
              and designer perfumes.
            </p>

            <a href="#perfume-collection" className="perfume-hero-button">
              Explore Collection <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="perfume-collection" id="perfume-collection">
        <div className="collection-heading">
          <span>EXPLORE OUR FRAGRANCES</span>
          <h2>Our Perfume Collection</h2>
          <p>
            Find a fragrance that matches your personality and style.
          </p>
        </div>

        <div className="perfume-tabs">
          <button
            className={activeCategory === "designer" ? "active" : ""}
            onClick={() => setActiveCategory("designer")}
          >
            Designer Perfumes
          </button>

          <button
            className={activeCategory === "regular" ? "active" : ""}
            onClick={() => setActiveCategory("regular")}
          >
            Regular Perfumes
          </button>
        </div>

        <div className="perfume-product-grid">
          {perfumes.map((perfume) => (
            <article className="perfume-product-card" key={perfume.id}>
              <div className="perfume-product-image">
               <img
               src={`${import.meta.env.BASE_URL}${perfume.image.replace(/^\/+/, "")}`}
               alt={perfume.name}/>

                {!perfume.inStock && (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="perfume-product-details">
                <span className="perfume-brand">{perfume.brand}</span>

                <h3>{perfume.name}</h3>

                <p className="perfume-price">
                  {formatPrice(perfume.price)}
                </p>

                <button
                  className="perfume-order-button"
                  disabled={!perfume.inStock}
                  onClick={() => handleEnquiry(perfume)}
                >
                  {perfume.inStock ? "Enquire on WhatsApp" : "Unavailable"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="perfume-bottom-banner">
        <div>
          <span>GIFT SOMETHING SPECIAL</span>
          <h2>Make Every Moment Memorable</h2>
          <p>
            Explore our gift hampers and surprise packages for
            someone special.
          </p>
          <Link to="/Gifts" className="perfume-hero-button">
            Explore Gifts <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Perfumes;
