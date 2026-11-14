
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
import { supabase } from "../lib/supabase";
import "./Cart.css";

const CART_KEY = "kennyscent-cart";
const WHATSAPP_NUMBER = "2347038511572";

const formatPrice = (price) =>
  `₦${Number(price || 0).toLocaleString("en-NG")}`;

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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

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
        ? {
            ...item,
            quantity: Number(item.quantity || 1) + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Number(item.quantity || 1) - 1,
            }
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
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  // Create the WhatsApp order message.
  const createCheckoutMessage = (reference) => {
    return [
      "Hello KennyScents & Confectionery!",
      "I would like to place an order.",
      "",
      "========== ORDER REFERENCE ==========",
      reference,
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
        `Subtotal: ${formatPrice(
          Number(item.price) * Number(item.quantity)
        )}`,
        `Product Picture: ${getPublicImageUrl(item.image)}`,
        "",
      ]),
      "========== ORDER SUMMARY ==========",
      `Total Items: ${totalItems}`,
      `Grand Total: ${formatPrice(total)}`,
      "",
      "Please confirm my order and delivery details.",
      "Thank you!",
    ].join("\n");
  };

  // Save order and order items to Supabase.
  const handleCheckout = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0 || isCheckingOut) return;

    setCheckoutError("");
    setIsCheckingOut(true);

    // Open a blank tab immediately so the browser
    // is less likely to block WhatsApp after saving.
    const whatsappWindow = window.open("about:blank", "_blank");

    try {
      const newOrderId = crypto.randomUUID();

      const newOrderNumber =
        `KS-${Date.now().toString(36).toUpperCase()}-` +
        Math.random().toString(36).slice(2, 6).toUpperCase();

      const orderPayload = {
        id: newOrderId,
        order_number: newOrderNumber,
        customer_name: customerDetails.name.trim(),
        customer_phone: customerDetails.phone.trim(),
        customer_email: customerDetails.email.trim(),
        delivery_address: customerDetails.address.trim(),
        total_amount: total,
        total_items: totalItems,
      };

      const orderItems = cartItems.map((item) => ({
        product_id:
          typeof item.productId === "string" &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId)
            ? item.productId
            : null,

        product_name: item.name,
        category: item.category || "Product",
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price || 0),
        subtotal:
          Number(item.price || 0) *
          Number(item.quantity || 1),
        image_url: item.image || null,
      }));

      const { data, error } = await supabase.rpc(
        "create_order_with_items",
        {
          p_order: orderPayload,
          p_items: orderItems,
        }
      );

      if (error) throw error;

      const savedOrderNumber =
        data?.order_number || newOrderNumber;

      const message = createCheckoutMessage(savedOrderNumber);

      const link =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      setOrderNumber(savedOrderNumber);
      setWhatsappUrl(link);

      // Only clear the cart after Supabase confirms success.
      localStorage.removeItem(CART_KEY);
      setCartItems([]);

      window.dispatchEvent(new Event("cartUpdated"));

      setOrderPlaced(true);

      if (whatsappWindow) {
        whatsappWindow.location.href = link;
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setCheckoutError(
        error.message ||
          "We couldn't save your order. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
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

          <h2>Your order has been recorded.</h2>

          <p>
            Your order reference is:
            <strong> {orderNumber}</strong>
          </p>

          <p>
            Your order has been saved successfully.
            Please continue on WhatsApp to confirm your
            order and delivery details with our team.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cart-shop-button"
          >
            <MessageCircle size={18} />
            Continue to WhatsApp
          </a>

          <Link to="/" className="cart-continue">
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
        <p>
          Review your selected items before placing your order.
        </p>
      </section>

      <section className="cart-content">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={42} />
            </div>

            <h2>Your cart is currently empty.</h2>

            <p>
              Discover something special from our perfume
              and balloon treat collections.
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
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
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
                        Number(item.price) *
                          Number(item.quantity)
                      )}
                    </strong>

                    <button
                      type="button"
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
                onSubmit={handleCheckout}
              >
                <h3>Delivery Information</h3>

                <p>
                  Please provide your details so we can process
                  your order.
                </p>

                <label htmlFor="customer-name">
                  Full Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={customerDetails.name}
                  onChange={handleDetailsChange}
                  required
                />

                <label htmlFor="customer-phone">
                  Phone Number
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  name="phone"
                  placeholder="e.g. 08012345678"
                  value={customerDetails.phone}
                  onChange={handleDetailsChange}
                  required
                />

                <label htmlFor="customer-email">
                  Email Address
                </label>

                <input
                  id="customer-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={customerDetails.email}
                  onChange={handleDetailsChange}
                  required
                />

                <label htmlFor="customer-address">
                  Delivery Address
                </label>

                <textarea
                  id="customer-address"
                  name="address"
                  placeholder="Enter your full delivery address"
                  value={customerDetails.address}
                  onChange={handleDetailsChange}
                  rows={4}
                  required
                />

                {checkoutError && (
                  <p
                    className="perfume-fetch-error"
                    role="alert"
                  >
                    {checkoutError}
                  </p>
                )}

                <button
                  type="submit"
                  className="cart-checkout-button"
                  disabled={isCheckingOut}
                >
                  <MessageCircle size={19} />

                  {isCheckingOut
                    ? "Saving Your Order..."
                    : "Checkout on WhatsApp"}
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
