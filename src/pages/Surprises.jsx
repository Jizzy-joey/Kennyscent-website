
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  CalendarDays,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "./Surprises.css";

const whatsappNumber = "2347038511572";

const getImagePath = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

const getPublicImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${window.location.origin}${getImagePath(path)}`;
};

function Surprises() {
  const [surpriseSetups, setSurpriseSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSurpriseSetups = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("surprise_setups")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setSurpriseSetups(data || []);
      } catch (err) {
        console.error("Error loading surprise setups:", err);
        setError("Unable to load surprise setups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSurpriseSetups();
  }, []);

  // BOOK A PARTICULAR SURPRISE SETUP
  const bookSetup = (setup) => {
    const message = [
      "Hello KennyScents & Confectionery!",
      "",
      "I am interested in booking one of your surprise setups.",
      "",
      "========== SETUP DETAILS ==========",
      `Setup Name: ${setup.name}`,
      `Occasion: ${setup.occasion}`,
      `Description: ${setup.description || "Not provided"}`,
      `Setup Picture: ${getPublicImageUrl(setup.image_url)}`,
      "",
      "========== BOOKING ENQUIRY ==========",
      "Please provide more information about:",
      "1. Pricing",
      "2. Availability",
      "3. Booking process",
      "4. Delivery and setup location",
      "",
      "Thank you!",
    ].join("\n");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  // REQUEST A CUSTOM SURPRISE OR EVENT DECORATION
  const requestCustomQuote = () => {
    const message = [
      "Hello KennyScents & Confectionery!",
      "",
      "I would like to request a custom surprise or event decoration.",
      "",
      "Please help me with the following:",
      "1. Available services",
      "2. Pricing and packages",
      "3. Available dates",
      "4. Booking requirements",
      "",
      "I would love to discuss my ideas with you.",
      "",
      "Thank you!",
    ].join("\n");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="surprises-page">

      {/* HERO SECTION */}
      <section className="surprises-hero">
        <div className="surprises-hero-content">
          <span className="surprises-eyebrow">
            MAKE EVERY MOMENT UNFORGETTABLE
          </span>

          <h1>
            Beautiful Surprises.
            <br />
            <span>Memories That Last.</span>
          </h1>

          <p>
            From romantic room surprises to luxury birthday setups,
            we help you turn special occasions into unforgettable
            experiences.
          </p>

          <a href="#surprise-gallery" className="surprises-gold-button">
            Explore Our Setups <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="surprises-intro">
        <Sparkles size={28} className="surprises-intro-icon" />

        <span className="surprises-eyebrow">
          A SPECIAL EXPERIENCE FOR SOMEONE SPECIAL
        </span>

        <h2>Because Every Celebration Deserves Something Beautiful.</h2>

        <p>
          Whether you're planning a birthday, anniversary, romantic
          surprise or a special celebration, let us help you create
          a moment worth remembering.
        </p>
      </section>

      {/* SURPRISE GALLERY */}
      <section className="surprise-gallery-section" id="surprise-gallery">
        <div className="surprise-gallery-heading">
          <span className="surprises-eyebrow">OUR WORK</span>
          <h2>Explore Our Surprise Setups</h2>
          <p>
            Get inspired by some of the beautiful experiences
            you can create with KennyScents.
          </p>
        </div>

        {loading && (
          <p className="surprise-loading">
            Loading our beautiful surprise setups...
          </p>
        )}

        {error && (
          <p className="surprise-error">
            {error}
          </p>
        )}

        {!loading && !error && surpriseSetups.length === 0 && (
          <p className="surprise-empty">
            No surprise setups are currently available.
            Please check back soon.
          </p>
        )}

        {!loading && !error && surpriseSetups.length > 0 && (
          <div className="surprise-gallery-grid">
            {surpriseSetups.map((setup) => (
              <article className="surprise-card" key={setup.id}>
                <div className="surprise-card-image">
                  {setup.image_url && (
                    <img
                      src={getImagePath(setup.image_url)}
                      alt={setup.name}
                      loading="lazy"
                    />
                  )}

                  <span className="surprise-card-label">
                    {setup.occasion}
                  </span>
                </div>

                <div className="surprise-card-content">
                  <h3>{setup.name}</h3>

                  <p>{setup.description}</p>

                  <button
                    type="button"
                    className="surprise-book-button"
                    onClick={() => bookSetup(setup)}
                    disabled={!setup.is_available}
                  >
                    {setup.is_available
                      ? "Book This Setup"
                      : "Currently Unavailable"}

                    {setup.is_available && <ArrowRight size={17} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CUSTOM EVENTS */}
      <section className="surprise-custom-section">
        <div className="surprise-custom-content">
          <span className="surprises-eyebrow">
            MADE JUST FOR YOU
          </span>

          <h2>Have a Different Surprise in Mind?</h2>

          <p>
            Not every celebration is the same. Tell us your ideas
            and let us help you plan a personalised surprise,
            birthday setup or event decoration.
          </p>

          <button
            type="button"
            className="surprises-gold-button"
            onClick={requestCustomQuote}
          >
            Request a Custom Quote <MessageCircle size={18} />
          </button>
        </div>
      </section>

      {/* HOW TO BOOK */}
      <section className="surprise-booking-section">
        <span className="surprises-eyebrow">LET'S GET STARTED</span>

        <h2>Booking Your Surprise Is Easy.</h2>

        <div className="surprise-booking-grid">
          <div>
            <span>01</span>
            <CalendarDays size={27} />
            <h3>Choose Your Setup</h3>
            <p>
              Browse our gallery and choose the surprise
              that inspires you.
            </p>
          </div>

          <div>
            <span>02</span>
            <MessageCircle size={27} />
            <h3>Contact Us</h3>
            <p>
              Tell us your preferred date, location and
              the type of celebration.
            </p>
          </div>

          <div>
            <span>03</span>
            <Sparkles size={27} />
            <h3>Let's Make It Special</h3>
            <p>
              We'll discuss your requirements and arrange
              the details with you.
            </p>
          </div>
        </div>

        <Link to="/contact" className="surprise-contact-link">
          Have Questions? Contact Us <ArrowRight size={17} />
        </Link>
      </section>

    </main>
  );
}

export default Surprises;
