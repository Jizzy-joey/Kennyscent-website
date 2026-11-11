
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link to="/cart" onClick={closeMenu}>Cart</Link>
        <Link to="/kgloss" onClick={closeMenu}>K'S GLOSS</Link>
      </div>

      <div className="nav-actions">
        <Link
          to="/cart"
          className="cart-link"
          aria-label="Shopping cart"
        >
          <ShoppingBag size={21} />
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
