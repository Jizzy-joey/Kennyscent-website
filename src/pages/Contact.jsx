
import {
  Camera,
  MessageCircle,
  Music2,
  ArrowUpRight,
  Mail,
} from "lucide-react";

import "./Contact.css";

function Contact() {
  // Replace these placeholders with your real business details.
  const whatsappNumber = "+2347038511572";
  const instagramUsername = "kennyscent_and_confectionery";
  const tiktokUsername = "kennyscentconfectionery";

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const socialLinks = [
    {
      name: "Instagram",
      username: `@${instagramUsername}`,
      description: "Explore our products, gifts and beautiful surprises.",
      link: `https://instagram.com/${instagramUsername}`,
      icon: <Camera size={27} />,
    },
    {
      name: "TikTok",
      username: `@${tiktokUsername}`,
      description: "Watch our latest products and special moments.",
      link: `https://www.tiktok.com/@${tiktokUsername}`,
      icon: <Music2 size={27} />,
    },
    {
      name: "WhatsApp",
      username: "Chat with our team",
      description: "Ask questions, make enquiries and place your orders.",
      link: whatsappLink,
      icon: <MessageCircle size={27} />,
    },
  ];

  return (
    <main className="contact-page">
      {/* HERO SECTION */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">WE ARE HERE FOR YOU</span>

          <h1>
            Let's Make
            <br />
            Something <span>Special.</span>
          </h1>

          <p>
            Whether you're looking for your signature fragrance,
            a thoughtful gift or a beautiful surprise, we'd love
            to hear from you.
          </p>

          <a href="#contact-details" className="contact-gold-button">
            Get In Touch <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="contact-intro">
        <span className="contact-eyebrow">LET'S CONNECT</span>
        <h2>We'd Love to Hear From You</h2>
        <p>
          Have a question or need help with an order?
          Connect with us through any of our social media platforms.
          We're happy to help make your experience special.
        </p>
      </section>

      {/* SOCIAL MEDIA CARDS */}
      <section className="contact-social-section" id="contact-details">
        <div className="contact-social-grid">
          {socialLinks.map((social) => (
            <a
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-card"
              key={social.name}
            >
              <div className="contact-social-icon">
                {social.icon}
              </div>

              <h3>{social.name}</h3>
              <span className="contact-social-username">
                {social.username}
              </span>

              <p>{social.description}</p>

              <span className="contact-social-visit">
                Connect With Us <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="contact-whatsapp-section">
        <div className="contact-whatsapp-icon">
          <MessageCircle size={35} />
        </div>

        <span className="contact-eyebrow">WE'RE JUST A MESSAGE AWAY</span>

        <h2>Need Something Special?</h2>

        <p>
          Tell us what you're looking for. Whether it's a perfume,
          gift hamper, birthday surprise or event decoration,
          let's make it happen.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-whatsapp-button"
        >
          <MessageCircle size={19} />
          Chat With Us on WhatsApp
        </a>
      </section>

      {/* CLOSING SECTION */}
      <section className="contact-closing">
        <Mail size={27} />

        <h2>Thank You for Choosing Kennyscent</h2>

        <p>
          We appreciate your interest in our brand.
          We look forward to making your next experience memorable.
        </p>
      </section>
    </main>
  );
}

export default Contact;
