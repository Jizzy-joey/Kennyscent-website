
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  designerPerfumes,
  regularPerfumes,
  formatPrice,
} from "../data/perfumes";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Perfumes.css";

const CART_KEY = "kennyscent-cart";

function Perfumes() {
  const [activeCategory, setActiveCategory] = useState("designer");
  const [addedPerfumeName, setAddedPerfumeName] = useState("");
  const [databasePerfumes, setDatabasePerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Load perfumes from Supabase
  useEffect(() => {
    const loadPerfumes = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("category", [
          "designer_perfume",
          "regular_perfume",
        ])
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
      } else {
        const formattedProducts = (data || []).map((product) => ({
          id: product.id,
          name: product.name,
          brand: product.brand || "",
          description: product.description || "",
          price: Number(product.price),
          image: product.image_url || "",
          inStock: product.in_stock,
          category: product.category,
        }));

        setDatabasePerfumes(formattedProducts);
      }

      setLoading(false);
    };

    loadPerfumes();
  }, []);

  // Select the existing products for the active tab
  const existingPerfumes =
    activeCategory === "designer"
      ? designerPerfumes
      : regularPerfumes;

  // Select the matching Supabase category
  const databaseCategory =
    activeCategory === "designer"
      ? "designer_perfume"
      : "regular_perfume";

  const matchingDatabasePerfumes = databasePerfumes.filter(
    (perfume) => perfume.category === databaseCategory
  );

  // Temporarily combine database and existing products.
  // Avoid displaying the same product name twice.
  const existingWithoutDuplicates = existingPerfumes.filter(
    (oldProduct) =>
      !matchingDatabasePerfumes.some(
        (newProduct) =>
          newProduct.name.trim().toLowerCase() ===
          oldProduct.name.trim().toLowerCase()
      )
  );

  const perfumes = [
    ...matchingDatabasePerfumes,
    ...existingWithoutDuplicates,
  ];

  // Handle product images
  const getImagePath = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
  };

  // Add perfume to shopping cart
  const handleAddToCart = (perfume) => {
    if (!perfume.inStock) return;

    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch {
      cart = [];
    }

    const cartId = `perfume-${perfume.id}`;

    const existingItem = cart.find(
      (item) => item.id === cartId
    );

    if (existingItem) {
      cart = cart.map((item) =>
        item.id === cartId
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      cart.push({
        id: cartId,
        productId: perfume.id,
        name: perfume.name,
        price: Number(perfume.price),
        image: perfume.image,
        quantity: 1,
        category: "Perfume",
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    setAddedPerfumeName(perfume.name);
  };

  return (
    <main className="perfumes-page">
      <section className="perfume-hero">
        <div className="perfume-hero-overlay">
          <div className="perfume-hero-content">
            <span className="perfume-eyebrow">
              KENNYSCENT COLLECTION
            </span>

            <h1>Find Your Signature Scent</h1>

            <p>
              Discover fragrances that leave a lasting impression.
              Explore our carefully selected collection of everyday
              and designer perfumes.
            </p>

            <a
              href="#perfume-collection"
              className="perfume-hero-button"
            >
              Explore Collection <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section
        className="perfume-collection"
        id="perfume-collection"
      >
        <div className="collection-heading">
          <span>EXPLORE OUR FRAGRANCES</span>

          <h2>Our Perfume Collection</h2>

          <p>
            Find a fragrance that matches your personality and style.
          </p>
        </div>

        <div className="perfume-tabs">
          <button
            className={activeCategory === "designer" ? "active" : ""}
            onClick={() => setActiveCategory("designer")}
          >
            Designer Perfumes
          </button>

          <button
            className={activeCategory === "regular" ? "active" : ""}
            onClick={() => setActiveCategory("regular")}
          >
            Regular Perfumes
          </button>
        </div>

        {fetchError && (
          <p className="perfume-fetch-error">
            We couldn't load the latest products from our store.
            Existing products are still displayed.
          </p>
        )}

        {loading ? (
          <p className="perfume-loading">
            Loading our perfume collection...
          </p>
        ) : perfumes.length === 0 ? (
          <p className="perfume-loading">
            No perfumes are currently available in this category.
          </p>
        ) : (
          <div className="perfume-product-grid">
            {perfumes.map((perfume) => (
              <article
                className="perfume-product-card"
                key={`${activeCategory}-${perfume.id}`}
              >
                <div className="perfume-product-image">
                  {perfume.image ? (
                    <img
                      src={getImagePath(perfume.image)}
                      alt={perfume.name}
                    />
                  ) : (
                    <div className="perfume-no-image">
                      Image coming soon
                    </div>
                  )}

                  {!perfume.inStock && (
                    <span className="out-of-stock">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="perfume-product-details">
                  <span className="perfume-brand">
                    {perfume.brand}
                  </span>

                  <h3>{perfume.name}</h3>

                  <p className="perfume-price">
                    {formatPrice(perfume.price)}
                  </p>

                  <button
                    className="perfume-order-button"
                    disabled={!perfume.inStock}
                    onClick={() => handleAddToCart(perfume)}
                  >
                    <ShoppingCart size={17} />

                    {perfume.inStock
                      ? "Add to Cart"
                      : "Unavailable"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {addedPerfumeName && (
          <div className="perfume-cart-message" role="status">
            <p>
              <strong>{addedPerfumeName}</strong> has been added to your cart!
            </p>

            <Link to="/cart">
              View Cart <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section className="perfume-bottom-banner">
        <div>
          <span>GIFT SOMETHING SPECIAL</span>

          <h2>Make Every Moment Memorable</h2>

          <p>
            Explore our gift hampers and surprise packages for
            someone special.
          </p>

          <Link to="/gifts" className="perfume-hero-button">
            Explore Gifts <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Perfumes;
