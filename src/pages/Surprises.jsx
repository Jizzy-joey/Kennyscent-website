
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  CalendarDays,
} from "lucide-react";


import "./Surprises.css";

function Surprises() {
  // Replace with your real Nigerian WhatsApp number.
  const whatsappNumber = "+2347038511572";

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

  const bookSetup = (setup) => {
    const message = encodeURIComponent(
      `Hello Kennyscent! I am interested in the ${setup.name}. Please tell me more about the pricing, availability and booking process.`
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
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
            you can create with Kennyscent.
          </p>
        </div>

        <div className="surprise-gallery-grid">
          {surpriseSetups.map((setup) => (
            <article className="surprise-card" key={setup.id}>
              <div className="surprise-card-image">
                <img
                  src={setup.image}
                  alt={setup.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.parentElement.classList.add(
                      "surprise-image-missing"
                    );
                  }}
                />

                <span className="surprise-card-label">
                  {setup.occasion}
                </span>
              </div>

              <div className="surprise-card-content">
                <h3>{setup.name}</h3>

                <p>{setup.description}</p>

                <button
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
            className="surprises-gold-button"
            onClick={() => {
              const message = encodeURIComponent(
                "Hello Kennyscent! I would like to discuss a custom surprise or event decoration. Please tell me more about your services."
              );

              window.open(
                `https://wa.me/${whatsappNumber}?text=${message}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
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

        <Link to="/Contact" className="surprise-contact-link">
          Have Questions? Contact Us <ArrowRight size={17} />
        </Link>
      </section>

    </main>
  );
}

export default Surprises;
