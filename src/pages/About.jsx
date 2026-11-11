
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./About.css";

const getImagePath = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;


function About() {
  return (
    <main className="about-page">

      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">OUR STORY, OUR PASSION</span>

          <h1>
            More Than Gifts.
            <br />
            <span>Beautiful Experiences.</span>
          </h1>

          <p>
            Every fragrance tells a story. Every gift carries a message.
            Every surprise creates a memory. Welcome to Kennyscent
            & Confectionery.
          </p>

          <Link to="/Contact" className="about-gold-button">
            Get in Touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* OWNER INTRODUCTION */}
      <section className="about-owner-section">
        <div className="about-owner-image">
          <img
          src={getImagePath("/images/kenny.jpeg")}
          alt="Kenny Opeifah, owner of Kennyscent & Confectionery"/>
        </div>

        <div className="about-owner-content">
          <span className="about-eyebrow">THE PERSON BEHIND THE BRAND</span>

          <h2>
            Meet <span>Kenny Opeifah.</span>
          </h2>

          <p>
            Behind Kennyscent & Confectionery is Kenny Opeifah,
            the person behind the brand and its vision.
          </p>

          <p>
            Kennyscent was created around the idea that life's
            special moments deserve thoughtful details. From
            choosing a fragrance to putting together a meaningful
            gift or planning a memorable surprise, the goal is to
            make every experience feel special.
          </p>

          <p>
            Through the brand, Kenny brings together fragrances,
            gifting and celebration experiences in one place,
            making it easier to find something lovely for yourself
            or someone you care about.
          </p>

          <div className="about-owner-signature">
            <span>Kenny Opeifah</span>
            <small>Founder, Kennyscent & Confectionery</small>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="about-story-section">
        <div className="about-story-heading">
          <span className="about-eyebrow">WHAT WE ARE ABOUT</span>
          <h2>Making Ordinary Moments Feel Extraordinary.</h2>
        </div>

        <div className="about-story-text">
          <p>
            At Kennyscent & Confectionery, we believe that the
            smallest details can make the biggest difference.
            A beautiful fragrance, a carefully selected gift or
            a thoughtfully planned surprise can make someone feel
            appreciated and remembered.
          </p>

          <p>
            That's why we bring together products and services
            designed to help you celebrate, appreciate and create
            beautiful memories with the people who matter.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="about-offerings-section">
        <div className="about-offerings-heading">
          <span className="about-eyebrow">EXPLORE KENNYSCENT</span>
          <h2>A Little Something for Every Occasion.</h2>
          <p>
            Discover what we have to offer.
          </p>
        </div>

        <div className="about-offerings-grid">
          <article className="about-offering-card">
            <span>01</span>
            <h3>Perfumes</h3>
            <p>
              Explore our collection of regular and designer
              fragrances for different tastes and occasions.
            </p>
            <Link to="/Perfumes">
              Explore Perfumes <ArrowRight size={16} />
            </Link>
          </article>

          <article className="about-offering-card">
            <span>02</span>
            <h3>Gift Hampers</h3>
            <p>
              Thoughtful gift hampers for men and women,
              perfect for making someone feel appreciated.
            </p>
            <Link to="/Gifts">
              Explore Gifts <ArrowRight size={16} />
            </Link>
          </article>

          <article className="about-offering-card">
            <span>03</span>
            <h3>Surprises & Events</h3>
            <p>
              Surprise packages, birthday setups and event
              decorations for memorable celebrations.
            </p>
            <Link to="/Surprises">
              Explore Surprises <ArrowRight size={16} />
            </Link>
          </article>

          <article className="about-offering-card">
            <span>04</span>
            <h3>K'S GLOSS</h3>
            <p>
              Discover our separate beauty brand and explore
              its lip gloss collection.
            </p>
            <Link to="/KGloss">
              Discover K'S GLOSS <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="about-values-section">
        <span className="about-eyebrow">THE KENNYSCENT EXPERIENCE</span>
        <h2>Why We Do What We Do</h2>

        <div className="about-values-grid">
          <div>
            <h3>Thoughtfulness</h3>
            <p>
              We believe that choosing a gift or fragrance
              should feel meaningful.
            </p>
          </div>

          <div>
            <h3>Beautiful Experiences</h3>
            <p>
              We want every order, gift and celebration
              to feel memorable.
            </p>
          </div>

          <div>
            <h3>Personal Connection</h3>
            <p>
              We value the people behind every order
              and every special occasion.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-final-section">
        <span className="about-eyebrow">LET'S MAKE MEMORIES</span>
        <h2>Have Something Special in Mind?</h2>
        <p>
          We'd love to help you find the perfect fragrance,
          gift or surprise.
        </p>

        <Link to="/Contact" className="about-gold-button">
          Contact Kennyscent <ArrowRight size={18} />
        </Link>
      </section>

    </main>
  );
}

export default About;
