
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  CalendarDays,
} from "lucide-react";

import "./Surprises.css";

const whatsappNumber = "2347038511572";

const getImagePath = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const getPublicImageUrl = (path) =>
  `${window.location.origin}${getImagePath(path)}`;

function Surprises() {
  const surpriseSetups = [
    {
      id: 1,
      name: "Romantic Silver Surprise",
      description:
        "A beautiful romantic room setup featuring silver balloons, LOVE petals, cake and a gift basket.",
      image: "/surprises/silver-balloon-surprise-room-setup.jpeg",
      occasion: "Romantic Surprise",
    },
    {
      id: 2,
      name: "Birthday Gift Display",
      description:
        "Celebrate someone special with birthday balloons, beautiful decorations and thoughtfully arranged gifts.",
      image: "/surprises/birthday-surprise-gift-display-green-bed.jpeg",
      occasion: "Birthday Surprise",
    },
    {
      id: 3,
      name: "Blue & Silver Birthday Setup",
      description:
        "A stylish blue and silver birthday decoration with balloons and a beautifully arranged celebration table.",
      image: "/surprises/blue-silver-birthday-surprise-decor.jpeg",
      occasion: "Birthday Decoration",
    },
    {
      id: 4,
      name: "Luxury Romantic Room Setup",
      description:
        "Create an unforgettable atmosphere with romantic lighting, silver balloons and elegant gift displays.",
      image: "/surprises/dark-romantic-surprise-room-led-decor.jpeg",
      occasion: "Romantic Room Setup",
    },
    {
      id: 5,
      name: "Luxury Black Birthday Setup",
      description:
        "A bold and elegant birthday experience featuring black balloons, rose petals and beautiful decorations.",
      image: "/surprises/luxury-black-birthday-surprise-setup.jpeg",
      occasion: "Luxury Birthday Setup",
    },
  ];

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
      `Description: ${setup.description}`,
      `Setup Picture: ${getPublicImageUrl(setup.image)}`,
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

        <div className="surprise-gallery-grid">
          {surpriseSetups.map((setup) => (
            <article className="surprise-card" key={setup.id}>
              <div className="surprise-card-image">
                <img
                  src={getImagePath(setup.image)}
                  alt={setup.name}
                  loading="lazy"
                />

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
                >
                  Book This Setup <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
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
