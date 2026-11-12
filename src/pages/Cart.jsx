
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import "./Cart.css";

const CART_KEY = "kennyscent-cart";
const WHATSAPP_NUMBER = "2347038511572";

const formatPrice = (price) =>
  `₦${Number(price || 0).toLocaleString("en-NG")}`;

// Get the full public image URL for WhatsApp.
const getPublicImageUrl = (image) => {
  if (!image) return "Image unavailable";

  if (image.startsWith("http")) {
    return image;
  }

  return `${window.location.origin}${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
const [orderPlaced, setOrderPlaced] = useState(false);

const [customerDetails, setCustomerDetails] = useState({
  name: "",
  phone: "",
  email: "",
  address: "",
});

const handleDetailsChange = (event) => {
  const { name, value } = event.target;

  setCustomerDetails((previous) => ({
    ...previous,
    [name]: value,
  }));
};

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCartItems(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCartItems([]);
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Number(item.quantity || 1) + 1 }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Number(item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => Number(item.quantity) > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  // Prepare a detailed WhatsApp order.
  const checkoutMessage = [
  "Hello KennyScents & Confectionery!",
  "I would like to place an order.",
  "",
  "========== CUSTOMER DETAILS ==========",
  `Full Name: ${customerDetails.name}`,
  `Phone Number: ${customerDetails.phone}`,
  `Email Address: ${customerDetails.email}`,
  `Delivery Address: ${customerDetails.address}`,
  "",
  "========== ORDER DETAILS ==========",
  "",
  ...cartItems.flatMap((item, index) => [
    `${index + 1}. ${item.name}`,
    `Category: ${item.category || "Product"}`,
    `Quantity: ${item.quantity}`,
    `Unit Price: ${formatPrice(item.price)}`,
    `Subtotal: ${formatPrice(Number(item.price) * Number(item.quantity))}`,
    `Product Picture: ${getPublicImageUrl(item.image)}`,
    "",
  ]),
  "========== ORDER SUMMARY ==========",
  `Total Items: ${cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0)}`,
  `Grand Total: ${formatPrice(total)}`,
  "",
  "Please confirm my order and delivery details.",
  "Thank you!",
].join("\n");

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  checkoutMessage
)}`;

  const handleCheckout = (event) => {
  event.preventDefault();

  if (cartItems.length === 0) return;

  // Open WhatsApp with the customer's details and order.
  window.open(
    whatsappLink,
    "_blank",
    "noopener,noreferrer"
  );

  // Clear the cart.
  localStorage.removeItem(CART_KEY);
  setCartItems([]);

  // Reset the cart notification.
  window.dispatchEvent(new Event("cartUpdated"));

  // Show the thank-you screen.
  setOrderPlaced(true);
};

  // THANK YOU SCREEN
  if (orderPlaced) {
    return (
      <main className="cart-page">
        <section className="thank-you-section">
          <div className="thank-you-icon">
            <CheckCircle size={55} />
          </div>

          <p className="cart-eyebrow">
            KENNYSCENT & CONFECTIONERY
          </p>

          <h1>Thank You!</h1>

          <h2>Thank you for your purchase.</h2>

          <p>
            Your order has been prepared for WhatsApp.
            We look forward to making your experience special.
            Please complete your order with our team on WhatsApp.
          </p>

          <Link to="/" className="cart-shop-button">
            <ShoppingBag size={18} />
            Return to Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
        <h1>My Cart</h1>
        <p>Review your selected items before placing your order.</p>
      </section>

      <section className="cart-content">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={42} />
            </div>

            <h2>Your cart is currently empty.</h2>

            <p>
              Discover something special from our perfume and
              balloon treat collections.
            </p>

            <Link to="/perfumes" className="cart-shop-button">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-section-heading">
                <h2>Your Selected Items</h2>
                <span>{cartItems.length} item(s)</span>
              </div>

              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${import.meta.env.BASE_URL}${item.image.replace(/^\/+/, "")}`
                        }
                        alt={item.name}
                      />
                    ) : (
                      <ShoppingBag size={30} />
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)}</p>

                    <div className="cart-quantity">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      {formatPrice(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </strong>

                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <Link to="/perfumes" className="cart-continue">
                <ArrowLeft size={17} />
                Continue Shopping
              </Link>
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <div className="cart-summary-row cart-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <p>
                Delivery fees, if applicable, will be confirmed
                when you place your order.
              </p>

              <form
              className="checkout-customer-form"
              onSubmit={handleCheckout}>
                <h3>Delivery Information</h3>
                <p>Please provide your details so we can process your order.</p>
                <label htmlFor="customer-name">Full Name</label>
              <input
                id="customer-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={customerDetails.name}
                onChange={handleDetailsChange}required
              />
              <label htmlFor="customer-phone">Phone Number</label>
              <input
                id="customer-phone"
                type="tel"
                name="phone"
                placeholder="e.g. 08012345678"
                value={customerDetails.phone}
                onChange={handleDetailsChange}required
              />
                
              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={customerDetails.email}
                onChange={handleDetailsChange}
                required
              />
                
              <label htmlFor="customer-address">Delivery Address</label>
              <textarea
                id="customer-address"
                name="address"
                placeholder="Enter your full delivery address"
                value={customerDetails.address}
                onChange={handleDetailsChange}
                rows={4}
                required
              />
                
                <button
                type="submit"
                className="cart-checkout-button">
                  <MessageCircle size={19} />
                  Checkout on WhatsApp
                  </button>
              </form>

            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
