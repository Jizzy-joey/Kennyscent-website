
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import "../App.css";

export default function Cart() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">YOUR SHOPPING BAG</p>
        <h1>My Cart</h1>
        <p>Review your selected items before placing your order.</p>
      </section>

      <section className="empty-cart">
        <ShoppingBag size={55} />
        <h2>Your cart is currently empty.</h2>
        <p>Discover something special from our collections.</p>
        <Link to="/perfumes" className="gold-button">
          Start Shopping
        </Link>
      </section>
    </main>
  );
}
