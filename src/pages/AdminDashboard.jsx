


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Pencil,
  Trash2,
  LogOut,
  Upload,
  ShoppingBag,
  RefreshCw,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";
import SurpriseSetupManager from "./SurpriseSetupManager";

const categories = [
  { value: "designer_perfume", label: "Designer Perfumes" },
  { value: "regular_perfume", label: "Regular Perfumes" },
  { value: "gift_package_him", label: "Gift Packages for Him" },
  { value: "gift_package_her", label: "Gift Packages for Her" },
  { value: "balloon_treat_him", label: "Balloon Treats for Him" },
  { value: "balloon_treat_her", label: "Balloon Treats for Her" },
];

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

const initialForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  category: "designer_perfume",
  in_stock: true,
  is_active: true,
};

const initialSurpriseForm = {
  name: "",
  description: "",
  occasion: "",
  is_available: true,
  is_active: true,
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [surpriseSetups, setSurpriseSetups] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [surpriseForm, setSurpriseForm] = useState(initialSurpriseForm);

  const [imageFile, setImageFile] = useState(null);
  const [surpriseImageFile, setSurpriseImageFile] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSurprise, setEditingSurprise] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [surprisesLoading, setSurprisesLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savingSurprise, setSavingSurprise] = useState(false);

  const [updatingOrder, setUpdatingOrder] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadSurpriseSetups();
  }, []);

  // LOAD PRODUCTS
  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  // LOAD ORDERS AND THEIR ITEMS
  const loadOrders = async () => {
    setOrdersLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setOrders(data || []);
    }

    setOrdersLoading(false);
  };

  // LOAD SURPRISE SETUPS
  const loadSurpriseSetups = async () => {
    setSurprisesLoading(true);

    const { data, error } = await supabase
      .from("surprise_setups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSurpriseSetups(data || []);
    }

    setSurprisesLoading(false);
  };

  // UPDATE ORDER STATUS
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      setError(`Could not update order: ${error.message}`);
    } else {
      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSuccess("Order status updated successfully!");
    }

    setUpdatingOrder("");
  };

  // FORMAT PRICE
  const formatPrice = (price) =>
    `₦${Number(price || 0).toLocaleString("en-NG")}`;

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // CUSTOMER WHATSAPP LINK
  const getCustomerWhatsAppLink = (phone) => {
    let number = String(phone || "").replace(/\D/g, "");

    if (number.startsWith("0")) {
      number = `234${number.slice(1)}`;
    }

    if (!number) return "";

    return `https://wa.me/${number}`;
  };

  // HANDLE PRODUCT FORM INPUTS
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // HANDLE PRODUCT IMAGE SELECTION
  const handleImageChange = (event) => {
    setImageFile(event.target.files[0] || null);
  };

  // RESET PRODUCT FORM
  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingProduct(null);

    const imageInput = document.getElementById("product-image");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      description: product.description || "",
      price: String(product.price),
      category: product.category,
      in_stock: product.in_stock,
      is_active: product.is_active,
    });

    setImageFile(null);
    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // UPLOAD PRODUCT IMAGE
  const uploadImage = async () => {
    if (!imageFile) {
      return editingProduct?.image_url || null;
    }

    const safeName = imageFile.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "-"
    );

    const filePath = `products/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // SAVE PRODUCT
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const imageUrl = await uploadImage();

      const productData = {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        description: form.description.trim() || null,
        price: Number(form.price),
        category: form.category,
        image_url: imageUrl,
        in_stock: form.in_stock,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        setSuccess("Product updated successfully!");
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;

        setSuccess("Product added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Product deleted successfully!");
      await loadProducts();
    }
  };

  // HANDLE SURPRISE FORM INPUTS
  const handleSurpriseChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSurpriseForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // HANDLE SURPRISE IMAGE SELECTION
  const handleSurpriseImageChange = (event) => {
    setSurpriseImageFile(event.target.files[0] || null);
  };

  // RESET SURPRISE FORM
  const resetSurpriseForm = () => {
    setSurpriseForm(initialSurpriseForm);
    setSurpriseImageFile(null);
    setEditingSurprise(null);

    const imageInput = document.getElementById("surprise-image");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  // EDIT SURPRISE SETUP
  const handleEditSurprise = (setup) => {
    setEditingSurprise(setup);

    setSurpriseForm({
      name: setup.name || "",
      description: setup.description || "",
      occasion: setup.occasion || "",
      is_available: setup.is_available,
      is_active: setup.is_active,
    });

    setSurpriseImageFile(null);
    setSuccess("");
    setError("");

    document
      .getElementById("surprise-form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // UPLOAD SURPRISE IMAGE
  const uploadSurpriseImage = async () => {
    if (!surpriseImageFile) {
      return editingSurprise?.image_url || null;
    }

    const safeName = surpriseImageFile.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "-"
    );

    const filePath = `surprises/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, surpriseImageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ADD OR UPDATE SURPRISE SETUP
  const handleSurpriseSubmit = async (event) => {
    event.preventDefault();

    setSavingSurprise(true);
    setError("");
    setSuccess("");

    try {
      const imageUrl = await uploadSurpriseImage();

      const surpriseData = {
        name: surpriseForm.name.trim(),
        description: surpriseForm.description.trim() || null,
        occasion: surpriseForm.occasion.trim(),
        image_url: imageUrl,
        is_available: surpriseForm.is_available,
        is_active: surpriseForm.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingSurprise) {
        const { error } = await supabase
          .from("surprise_setups")
          .update(surpriseData)
          .eq("id", editingSurprise.id);

        if (error) throw error;

        setSuccess("Surprise setup updated successfully!");
      } else {
        const { error } = await supabase
          .from("surprise_setups")
          .insert(surpriseData);

        if (error) throw error;

        setSuccess("Surprise setup added successfully!");
      }

      resetSurpriseForm();
      await loadSurpriseSetups();
    } catch (err) {
      setError(err.message || "Could not save surprise setup.");
    } finally {
      setSavingSurprise(false);
    }
  };

  // DELETE SURPRISE SETUP
  const handleDeleteSurprise = async (setup) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${setup.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("surprise_setups")
      .delete()
      .eq("id", setup.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Surprise setup deleted successfully!");

      if (editingSurprise?.id === setup.id) {
        resetSurpriseForm();
      }

      await loadSurpriseSetups();
    }
  };

  // LOG OUT
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/admin");
  };

  // GET CATEGORY NAME
  const getCategoryName = (value) =>
    categories.find((category) => category.value === value)?.label || value;

  // FIX IMAGE PATHS
  const getProductImage = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${import.meta.env.BASE_URL}${imageUrl.replace(/^\/+/, "")}`;
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">
            KENNYSCENT & CONFECTIONERY
          </p>

          <h1>Admin Dashboard</h1>

          <p>Manage your orders, products and surprise setups from one place.</p>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </header>

      {error && (
        <p className="admin-message admin-error">{error}</p>
      )}

      {success && (
        <p className="admin-message admin-success">{success}</p>
      )}

      {/* ORDERS SECTION */}
      <section className="admin-orders-section">
        <div className="admin-section-heading admin-orders-heading">
          <div>
            <ShoppingBag size={23} />
            <h2>Customer Orders ({orders.length})</h2>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadOrders}
            disabled={ordersLoading}
          >
            <RefreshCw
              size={16}
              className={ordersLoading ? "admin-spinning" : ""}
            />
            Refresh Orders
          </button>
        </div>

        {ordersLoading ? (
          <p className="admin-loading">Loading customer orders...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">
            No customer orders have been received yet.
          </p>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <div className="admin-order-top">
                  <div>
                    <span className="admin-order-reference">
                      {order.order_number}
                    </span>

                    <p className="admin-order-date">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span
                    className={`admin-order-status status-${String(
                      order.status || "pending"
                    ).toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="admin-order-customer">
                  <h3>{order.customer_name}</h3>

                  <p>
                    <strong>Phone:</strong> {order.customer_phone}
                  </p>

                  <p>
                    <strong>Email:</strong> {order.customer_email}
                  </p>

                  <p>
                    <strong>Delivery address:</strong>{" "}
                    {order.delivery_address}
                  </p>

                  {getCustomerWhatsAppLink(order.customer_phone) && (
                    <a
                      className="admin-customer-whatsapp"
                      href={getCustomerWhatsAppLink(order.customer_phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={16} />
                      Contact Customer on WhatsApp
                    </a>
                  )}
                </div>

                <div className="admin-order-items">
                  <h4>Products Ordered</h4>

                  {(order.order_items || []).map((item) => (
                    <div className="admin-order-item" key={item.id}>
                      {item.image_url ? (
                        <img
                          src={getProductImage(item.image_url)}
                          alt={item.product_name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="admin-order-item-placeholder">
                          <ShoppingBag size={20} />
                        </div>
                      )}

                      <div className="admin-order-item-details">
                        <strong>{item.product_name}</strong>
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit price: {formatPrice(item.unit_price)}</span>
                      </div>

                      <strong className="admin-order-item-subtotal">
                        {formatPrice(item.subtotal)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="admin-order-bottom">
                  <div>
                    <span>Total items: {order.total_items}</span>
                    <strong>{formatPrice(order.total_amount)}</strong>
                  </div>

                  <label className="admin-order-status-control">
                    <span>Update order status</span>

                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleOrderStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      disabled={updatingOrder === order.id}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingOrder === order.id && (
                      <small>Saving status...</small>
                    )}
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SURPRISE SETUP FORM */}
      <section
        className="admin-product-form-section admin-surprise-form-section"
        id="surprise-form-section"
      >
        <div className="admin-section-heading">
          <Sparkles size={23} />

          <h2>
            {editingSurprise
              ? "Edit Surprise Setup"
              : "Add New Surprise Setup"}
          </h2>
        </div>

        <form
          className="admin-product-form"
          onSubmit={handleSurpriseSubmit}
        >
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="surprise-name">Setup Name *</label>

              <input
                id="surprise-name"
                name="name"
                value={surpriseForm.name}
                onChange={handleSurpriseChange}
                placeholder="e.g. Luxury Birthday Setup"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="surprise-occasion">Occasion *</label>

              <input
                id="surprise-occasion"
                name="occasion"
                value={surpriseForm.occasion}
                onChange={handleSurpriseChange}
                placeholder="e.g. Birthday Surprise"
                required
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="surprise-description">
              Setup Description
            </label>

            <textarea
              id="surprise-description"
              name="description"
              value={surpriseForm.description}
              onChange={handleSurpriseChange}
              placeholder="Describe this surprise setup..."
              rows="4"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="surprise-image">
              Setup Picture{" "}
              {editingSurprise && "(Optional when editing)"}
            </label>

            <label
              className="admin-image-upload"
              htmlFor="surprise-image"
            >
              <Upload size={20} />

              <span>
                {surpriseImageFile
                  ? surpriseImageFile.name
                  : "Choose a surprise setup picture"}
              </span>
            </label>

            <input
              id="surprise-image"
              type="file"
              accept="image/*"
              onChange={handleSurpriseImageChange}
              hidden
            />

            {editingSurprise?.image_url && !surpriseImageFile && (
              <p className="admin-current-image">
                Current setup picture will be kept unless you choose another.
              </p>
            )}
          </div>

          <div className="admin-checkboxes">
            <label>
              <input
                type="checkbox"
                name="is_available"
                checked={surpriseForm.is_available}
                onChange={handleSurpriseChange}
              />
              Available for Booking
            </label>

            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={surpriseForm.is_active}
                onChange={handleSurpriseChange}
              />
              Visible on Website
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-save-button"
              disabled={savingSurprise}
            >
              {savingSurprise
                ? "Saving..."
                : editingSurprise
                  ? "Update Surprise Setup"
                  : "Add Surprise Setup"}
            </button>

            {editingSurprise && (
              <button
                type="button"
                className="admin-cancel-button"
                onClick={resetSurpriseForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SURPRISE SETUPS LIST */}
      <section className="admin-products-section admin-surprises-section">
        <div className="admin-section-heading admin-orders-heading">
          <div>
            <Sparkles size={23} />
            <h2>Your Surprise Setups ({surpriseSetups.length})</h2>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadSurpriseSetups}
            disabled={surprisesLoading}
          >
            <RefreshCw
              size={16}
              className={surprisesLoading ? "admin-spinning" : ""}
            />
            Refresh Setups
          </button>
        </div>

        {surprisesLoading ? (
          <p className="admin-loading">Loading surprise setups...</p>
        ) : surpriseSetups.length === 0 ? (
          <p className="admin-empty">
            No surprise setups have been added yet.
          </p>
        ) : (
          <div className="admin-products-grid">
            {surpriseSetups.map((setup) => (
              <article
                className="admin-product-card admin-surprise-card"
                key={setup.id}
              >
                {setup.image_url ? (
                  <img
                    src={getProductImage(setup.image_url)}
                    alt={setup.name}
                    className="admin-product-image"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="admin-no-image">
                    No image uploaded
                  </div>
                )}

                <div className="admin-product-info">
                  <span className="admin-product-category">
                    {setup.occasion}
                  </span>

                  <h3>{setup.name}</h3>

                  <p>{setup.description}</p>

                  <div className="admin-product-status">
                    <span>
                      {setup.is_available
                        ? "Available for Booking"
                        : "Unavailable"}
                    </span>

                    <span>
                      {setup.is_active ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      onClick={() => handleEditSurprise(setup)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => handleDeleteSurprise(setup)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PRODUCT FORM */}
      <section className="admin-product-form-section">
        <div className="admin-section-heading">
          <PackagePlus size={23} />

          <h2>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="product-name">Product Name *</label>

              <input
                id="product-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-brand">Brand</label>

              <input
                id="product-brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Enter brand (if applicable)"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-price">Price (₦) *</label>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-category">Category *</label>

              <select
                id="product-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-description">
              Description
            </label>

            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows="4"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-image">
              Product Image{" "}
              {editingProduct && "(Optional when editing)"}
            </label>

            <label
              className="admin-image-upload"
              htmlFor="product-image"
            >
              <Upload size={20} />

              <span>
                {imageFile
                  ? imageFile.name
                  : "Choose a product picture"}
              </span>
            </label>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            {editingProduct?.image_url && !imageFile && (
              <p className="admin-current-image">
                Current product image will be kept unless you
                choose another.
              </p>
            )}
          </div>

          <div className="admin-checkboxes">
            <label>
              <input
                type="checkbox"
                name="in_stock"
                checked={form.in_stock}
                onChange={handleChange}
              />
              In Stock
            </label>

            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Visible on Website
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingProduct && (
              <button
                type="button"
                className="admin-cancel-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* PRODUCT LIST */}
      <section className="admin-products-section">
        <div className="admin-section-heading">
          <h2>Your Products ({products.length})</h2>
        </div>

        {loading ? (
          <p className="admin-loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="admin-empty">
            No products have been added yet.
          </p>
        ) : (
          <div className="admin-products-grid">
            {products.map((product) => (
              <article
                className="admin-product-card"
                key={product.id}
              >
                {product.image_url ? (
                  <img
                    src={getProductImage(product.image_url)}
                    alt={product.name}
                    className="admin-product-image"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="admin-no-image">
                    No image uploaded
                  </div>
                )}

                <div className="admin-product-info">
                  <span className="admin-product-category">
                    {getCategoryName(product.category)}
                  </span>

                  <h3>{product.name}</h3>

                  {product.brand && <p>{product.brand}</p>}

                  <strong>{formatPrice(product.price)}</strong>

                  <div className="admin-product-status">
                    <span>
                      {product.in_stock ? "In Stock" : "Unavailable"}
                    </span>

                    <span>
                      {product.is_active ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {/* SURPRISE SETUPS MANAGEMENT */}
      <SurpriseSetupManager />

    </main>
  );
}

export default AdminDashboard;
