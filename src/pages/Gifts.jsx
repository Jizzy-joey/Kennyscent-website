
import { useEffect, useState } from "react";
import {
  giftPackagesForHim,
  giftPackagesForHer,
  balloonTreatsForHim,
  balloonTreatsForHer,
  formatGiftPrice,
} from "../data/gifts";

import {
  MessageCircle,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Gifts.css";

const whatsappNumber = "2347038511572";
const CART_KEY = "kennyscent-cart";

const getImagePath = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

const getPublicImageUrl = (path) => {
  if (!path) return "Image unavailable";

  return getImagePath(path);
};

// Prevent duplicate products when old and database products overlap.
const combineProducts = (oldProducts, newProducts) => {
  const filteredOldProducts = oldProducts.filter(
    (oldProduct) =>
      !newProducts.some(
        (newProduct) =>
          newProduct.name.trim().toLowerCase() ===
          oldProduct.name.trim().toLowerCase()
      )
  );

  return [...newProducts, ...filteredOldProducts];
};

function GiftCard({ gift, isBalloonTreat = false }) {
  const [added, setAdded] = useState(false);

  const message = [
    "Hello KennyScents & Confectionery!",
    "",
    "I would like to enquire about ordering this gift package.",
    "",
    "========== PRODUCT DETAILS ==========",
    `Product Name: ${gift.name}`,
    `Price: ${formatGiftPrice(gift.price)}`,
    `Product Picture: ${getPublicImageUrl(gift.image)}`,
    "",
    "Please confirm availability and provide information about delivery.",
    "Thank you!",
  ].join("\n");

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleAddToCart = () => {
    if (!gift.inStock) return;

    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch {
      cart = [];
    }

    const cartId = `balloon-${gift.id}`;

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
        productId: gift.id,
        name: gift.name,
        price: Number(gift.price),
        image: gift.image,
        quantity: 1,
        category: "Balloon Treat",
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    setAdded(true);
  };

  return (
    <article className="gift-card">
      <div className="gift-card-image">
        {gift.image ? (
          <img
            src={getImagePath(gift.image)}
            alt={gift.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement.classList.add(
                "image-unavailable"
              );
            }}
          />
        ) : (
          <div className="image-unavailable">
            Image unavailable
          </div>
        )}

        <span className="gift-image-label">KennyScents Gift</span>

        {!gift.inStock && (
          <span className="out-of-stock">Out of Stock</span>
        )}
      </div>

      <div className="gift-card-content">
        <h3>{gift.name}</h3>

        <p className="gift-price">
          {formatGiftPrice(gift.price)}
        </p>

        {isBalloonTreat ? (
          <>
            <button
              type="button"
              className="gift-order-button"
              onClick={handleAddToCart}
              disabled={!gift.inStock}
            >
              <ShoppingCart size={17} />
              {gift.inStock ? "Add to Cart" : "Unavailable"}
            </button>

            {added && (
              <div className="balloon-cart-message">
                <p>Added to your cart!</p>

                <Link to="/cart">
                  View Cart <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-order-button"
          >
            <MessageCircle size={17} />
            Order on WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}

function GiftSection({
  title,
  description,
  gifts,
  sectionId,
  isBalloonTreat = false,
}) {
  return (
    <section className="gift-section" id={sectionId}>
      <div className="gift-section-heading">
        <p className="gift-eyebrow">MADE WITH LOVE</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {gifts.length === 0 ? (
        <p className="gift-empty-message">
          No products are currently available in this collection.
        </p>
      ) : (
        <div className="gift-grid">
          {gifts.map((gift) => (
            <GiftCard
              gift={gift}
              key={gift.id}
              isBalloonTreat={isBalloonTreat}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Gifts() {
  const [databaseProducts, setDatabaseProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const loadGiftProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("category", [
          "gift_package_him",
          "gift_package_her",
          "balloon_treat_him",
          "balloon_treat_her",
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

        setDatabaseProducts(formattedProducts);
      }

      setLoading(false);
    };

    loadGiftProducts();
  }, []);

  const getProducts = (category, oldProducts) => {
    const matchingProducts = databaseProducts.filter(
      (product) => product.category === category
    );

    return combineProducts(oldProducts, matchingProducts);
  };

  const giftsForHim = getProducts(
    "gift_package_him",
    giftPackagesForHim
  );

  const giftsForHer = getProducts(
    "gift_package_her",
    giftPackagesForHer
  );

  const balloonsForHim = getProducts(
    "balloon_treat_him",
    balloonTreatsForHim
  );

  const balloonsForHer = getProducts(
    "balloon_treat_her",
    balloonTreatsForHer
  );

  return (
    <main className="gifts-page">
      <section className="gifts-hero">
        <div className="gifts-hero-content">
          <p className="gift-eyebrow">
            MAKE EVERY MOMENT SPECIAL
          </p>

          <h1>
            Gifts That Speak
            <span> From The Heart</span>
          </h1>

          <p className="gifts-hero-description">
            Thoughtfully selected gifts, beautifully arranged and
            presented to make your loved ones feel truly special.
            Whether it is a birthday, anniversary, celebration or
            just because, we have something for every moment.
          </p>

          <a href="#gift-collections" className="gifts-hero-button">
            Explore Our Gifts <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="gifts-intro" id="gift-collections">
        <p className="gift-eyebrow">THE PERFECT GIFT AWAITS</p>
        <h2>Explore Our Gift Collections</h2>

        <p>
          From elegant gift boxes to beautiful balloon treats,
          find something thoughtful for him or her.
        </p>

        <div className="gift-category-links">
          <a href="#gifts-for-him">Gift Packages for Him</a>
          <a href="#gifts-for-her">Gift Packages for Her</a>
          <a href="#balloons-for-him">Balloon Treats for Him</a>
          <a href="#balloons-for-her">Balloon Treats for Her</a>
        </div>
      </section>

      {fetchError && (
        <p className="gift-fetch-error">
          We couldn't load the latest products from our store.
          Existing products are still displayed.
        </p>
      )}

      {loading ? (
        <p className="gift-loading">Loading our gift collections...</p>
      ) : (
        <>
          <GiftSection
            sectionId="gifts-for-him"
            title="Gift Packages for Him"
            description="Thoughtfully arranged gift boxes for the special men in your life."
            gifts={giftsForHim}
          />

          <GiftSection
            sectionId="gifts-for-her"
            title="Gift Packages for Her"
            description="Beautiful gift combinations to make her feel loved, valued and appreciated."
            gifts={giftsForHer}
          />

          <GiftSection
            sectionId="balloons-for-him"
            title="Balloon Treats for Him"
            description="Celebrate his special moments with personalised balloon arrangements and treats."
            gifts={balloonsForHim}
            isBalloonTreat={true}
          />

          <GiftSection
            sectionId="balloons-for-her"
            title="Balloon Treats for Her"
            description="Colourful balloon treats and thoughtful surprises for the women who matter."
            gifts={balloonsForHer}
            isBalloonTreat={true}
          />
        </>
      )}

      <section className="custom-gift-section">
        <div className="custom-gift-content">
          <p className="gift-eyebrow">SOMETHING MORE PERSONAL?</p>
          <h2>Have a Gift in Mind?</h2>

          <p>
            Want a different combination, a personalised gift box,
            or something specially arranged for someone you love?
            Let us help you bring your idea to life.
          </p>

          <Link to="/contact" className="custom-gift-button">
            Request a Custom Gift <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
