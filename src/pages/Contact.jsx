
import "../App.css";

export default function Contact() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">WE ARE HERE TO HELP</p>
        <h1>Contact Us</h1>
        <p>
          Have a question, want to place an order or plan a surprise?
          We'd love to hear from you.
        </p>
      </section>

      <section className="contact-section">
        <h2>Let's Make Something Special.</h2>
        <p>Reach out to us through WhatsApp to make an enquiry or order.</p>

        <a
          href="https://wa.me/YOUR_WHATSAPP_NUMBER"
          target="_blank"
          rel="noreferrer"
          className="gold-button"
        >
          Chat With Us on WhatsApp
        </a>
      </section>
    </main>
  );
}
