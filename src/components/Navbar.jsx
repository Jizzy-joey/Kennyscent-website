
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
      const updateCartCount = () => {
        try {
          const cart = JSON.parse(
        localStorage.getItem("kennyscent-cart") || "[]"
      );

      const count = Array.isArray(cart)
        ? cart.reduce(
            (total, item) => total + Number(item.quantity || 1),
            0
          )
        : 0;

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  updateCartCount();

  window.addEventListener("cartUpdated", updateCartCount);
  window.addEventListener("storage", updateCartCount);

  return () => {
    window.removeEventListener("cartUpdated", updateCartCount);
    window.removeEventListener("storage", updateCartCount);
  };
}, []);


  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        KENNYSCENT
        <span>& CONFECTIONERY</span>
      </Link>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/perfumes" onClick={closeMenu}>Perfumes</Link>
        <Link to="/gifts" onClick={closeMenu}>Gifts</Link>
        <Link to="/surprises" onClick={closeMenu}>Surprises</Link>
        <Link to="/about" onClick={closeMenu}>About Us</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        <Link to="/kgloss" onClick={closeMenu}>K'S GLOSS</Link>
      </div>

      <div className="nav-actions">
        <Link
        to="/cart"
        className="cart-link"
        aria-label={`Shopping cart, ${cartCount} items`}>
          <ShoppingBag size={21} />
          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount > 99 ? "99+" : cartCount}
              </span>)}
          </Link>

        <button
          className="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
