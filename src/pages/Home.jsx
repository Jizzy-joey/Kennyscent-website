
import { Link } from "react-router-dom";
import {
  designerPerfumes,
  regularPerfumes,
  formatPrice,
} from "../data/perfumes";
import { ArrowRight } from "lucide-react";
import "../App.css";

function PerfumeCard({ perfume }) {
  return (
    <article className="perfume-card">
      <Link to="/Perfumes" className="perfume-image">
        <img src={perfume.image} alt={perfume.name} />
      </Link>

      <div className="perfume-info">
        <p className="perfume-brand">{perfume.brand}</p>
        <h3>{perfume.name}</h3>
        <p className="perfume-price">{formatPrice(perfume.price)}</p>
        <Link to="/Perfumes" className="product-link">
          View product <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function Home() {
  const featuredDesigners = designerPerfumes.slice(0, 3);
  const featuredRegular = regularPerfumes.slice(0, 3);

  return (
    <>
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">LUXURY • STYLE • THOUGHTFUL GIFTING</p>
            <h1>Make Every Moment <span>Memorable.</span></h1>
            <p>
              Discover beautiful fragrances, thoughtful gift hampers and
              unforgettable surprise experiences, all in one place.
            </p>
            <div className="hero-buttons">
              <Link to="/Perfumes" className="gold-button">
                Explore Perfumes <ArrowRight size={17} />
              </Link>
              <a href="#gifts" className="outline-button">
                Explore Our Collections
              </a>
            </div>
          </div>
        </section>

        <section className="intro-section">
          <p className="eyebrow">WELCOME TO KENNYSCENT</p>
          <h2>More Than Just a Gift. <span>It's an Experience.</span></h2>
          <p>
            From fragrances that leave a lasting impression to carefully
            arranged gifts and special surprises, we help you make every
            occasion count.
          </p>
        </section>

        <section className="perfume-section" id="perfumes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DISCOVER YOUR SIGNATURE SCENT</p>
              <h2>Our <span>Perfume Collection</span></h2>
              <p>Find a fragrance that speaks your style.</p>
            </div>
            <Link to="/Perfumes" className="view-all">
              View All Perfumes <ArrowRight size={17} />
            </Link>
          </div>

          <div className="perfume-category">
            <div className="category-heading">
              <h3>Designer Fragrances</h3>
              <p>Timeless scents from iconic fragrance houses.</p>
            </div>
            <div className="perfume-grid">
              {featuredDesigners.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          </div>

          <div className="perfume-category">
            <div className="category-heading">
              <h3>Regular Fragrances</h3>
              <p>Discover beautiful scents for every mood and occasion.</p>
            </div>
            <div className="perfume-grid">
              {featuredRegular.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          </div>

          <div className="center-button">
            <Link to="/Perfumes" className="gold-button">
              Shop All Perfumes <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="placeholder-section" id="gifts">
          <div className="placeholder-content">
            <p className="eyebrow">GIVE SOMETHING SPECIAL</p>
            <h2>Thoughtful Gifts, Beautifully Presented.</h2>
            <p>
              Explore our gift  for him and her, thoughtfully put
              together for life's special moments.
            </p>
            <Link to="/Gifts" className="gold-button">
              Explore Gifting Packages <ArrowRight size={17} />
            </Link>
          </div>
          <div className="image">
            <img src="/gifts/Gift package girls/01_red-heart-money-box_mel-jewelry-case_lashes_candle_ferrero_keychain_biscuits.jpeg" alt="Welcome to Kenny'scent" height={400} />
          </div>
        </section>

        <section className="placeholder-section reverse" id="surprises">
          <div className="placeholder-content">
            <p className="eyebrow">MAKE IT UNFORGETTABLE</p>
            <h2>Surprises They Will Never Forget.</h2>
            <p>
              From birthday surprises to romantic setups and event
              decorations, let us help you create special memories.
            </p>
            <Link to="/Surprises" className="gold-button">
              Explore Surprise Packages <ArrowRight size={17} />
            </Link>
          </div>
          <div className="image-coming-soon">
            Surprise setup image coming soon
          </div>
        </section>

        <section className="gloss-section">
          <div>
            <p className="eyebrow">A LITTLE EXTRA BEAUTY</p>
            <h2>Meet <span>K'S GLOSS</span></h2>
            <p>
              Discover the beauty of a perfect finishing touch with K'S GLOSS.
            </p>
            <Link to="/KGloss" className="gold-button">
              Explore K'S GLOSS <ArrowRight size={17} />
            </Link>
          </div>
          <div className="image-coming-soon">
            K'S GLOSS image coming soon
          </div>
        </section>

        <section className="about-section" id="about">
          <p className="eyebrow">A LITTLE ABOUT US</p>
          <h2>Making Every Occasion <span>Extra Special.</span></h2>
          <p>
            At Kennyscent & Confectionery, we believe the right fragrance,
            gift or surprise can turn an ordinary day into a lasting memory.
            We're here to help you celebrate life's moments beautifully.
          </p>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">WE WOULD LOVE TO HEAR FROM YOU</p>
          <h2>Let's Make Something <span>Special.</span></h2>
          <p>Have a question or want to arrange a special order?</p>
          <a
            href="https://wa.me/YOUR_WHATSAPP_NUMBER"
            target="_blank"
            rel="noreferrer"
            className="gold-button"
          >
            Contact Us on WhatsApp
          </a>
        </section>
      </main>

      <footer className="footer">
        <Link to="/" className="logo">
          KENNYSCENT
          <span>& CONFECTIONERY</span>
        </Link>
        <p>Luxury fragrances, thoughtful gifts and unforgettable moments.</p>
        <p className="copyright">
          © {new Date().getFullYear()} Kennyscent & Confectionery.
          All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Home;
