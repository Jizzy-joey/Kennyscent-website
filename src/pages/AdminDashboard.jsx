
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Pencil,
  Trash2,
  LogOut,
  Upload,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";

const categories = [
  { value: "designer_perfume", label: "Designer Perfumes" },
  { value: "regular_perfume", label: "Regular Perfumes" },
  { value: "gift_package_him", label: "Gift Packages for Him" },
  { value: "gift_package_her", label: "Gift Packages for Her" },
  { value: "balloon_treat_him", label: "Balloon Treats for Him" },
  { value: "balloon_treat_her", label: "Balloon Treats for Her" },
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

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0] || null);
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingProduct(null);

    const imageInput = document.getElementById("product-image");
    if (imageInput) imageInput.value = "";
  };

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return editingProduct?.image_url || null;
    }

    const safeName = imageFile.name
      .replace(/[^a-zA-Z0-9.-]/g, "-");

    const filePath = `products/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/admin");
  };

  const formatPrice = (price) =>
    `₦${Number(price).toLocaleString("en-NG")}`;

  const getCategoryName = (value) =>
    categories.find((category) => category.value === value)?.label || value;

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">
            KENNYSCENT & CONFECTIONERY
          </p>
          <h1>Product Management</h1>
          <p>Manage your store products from one place.</p>
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

      {error && <p className="admin-message admin-error">{error}</p>}
      {success && <p className="admin-message admin-success">{success}</p>}

      <section className="admin-product-form-section">
        <div className="admin-section-heading">
          <PackagePlus size={23} />
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
        </div>

        <form className="admin-product-form" onSubmit={handleSubmit}>
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
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-description">Description</label>
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
              Product Image {editingProduct && "(Optional when editing)"}
            </label>

            <label className="admin-image-upload" htmlFor="product-image">
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
                Current product image will be kept unless you choose another.
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
              <article className="admin-product-card" key={product.id}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="admin-product-image"
                  />
                ) : (
                  <div className="admin-no-image">No image uploaded</div>
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
    </main>
  );
}

export default AdminDashboard;
