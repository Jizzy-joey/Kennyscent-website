
import { Link } from "react-router-dom";
import { ShoppingBag, Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        KENNYSCENT
        <span>& CONFECTIONERY</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/Perfumes">Perfumes</Link>
        <Link to="/Gifts">Gifts</Link>
        <Link to="/Surprises">Surprises</Link>
        <Link to="/About">About Us</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/Cart">Cart</Link>
        <Link to="/KGloss">K'S GLOSS</Link>
      </div>

      <div className="nav-actions">
        <Link to="/Cart" className="cart-link" aria-label="Shopping cart">
          <ShoppingBag size={21} />
        </Link>

        <button className="mobile-menu" aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
