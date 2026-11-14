
import { useEffect, useState } from "react";
import { Pencil, Trash2, Upload, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";

const initialForm = {
  name: "",
  description: "",
  occasion: "",
  is_available: true,
  is_active: true,
};

function SurpriseSetupManager() {
  const [setups, setSetups] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingSetup, setEditingSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSetups();
  }, []);

  // LOAD SURPRISE SETUPS
  const loadSetups = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("surprise_setups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSetups(data || []);
    }

    setLoading(false);
  };

  // HANDLE FORM INPUTS
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingSetup(null);

    const input = document.getElementById("surprise-image");

    if (input) input.value = "";
  };

  // UPLOAD SURPRISE IMAGE
  const uploadImage = async () => {
    if (!imageFile) {
      return editingSetup?.image_url || null;
    }

    const safeName = imageFile.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "-"
    );

    const filePath = `surprises/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ADD OR UPDATE SETUP
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const imageUrl = await uploadImage();

      const setupData = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        occasion: form.occasion.trim(),
        image_url: imageUrl,
        is_available: form.is_available,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingSetup) {
        const { error } = await supabase
          .from("surprise_setups")
          .update(setupData)
          .eq("id", editingSetup.id);

        if (error) throw error;

        setSuccess("Surprise setup updated successfully!");
      } else {
        const { error } = await supabase
          .from("surprise_setups")
          .insert(setupData);

        if (error) throw error;

        setSuccess("Surprise setup added successfully!");
      }

      resetForm();
      await loadSetups();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // EDIT SETUP
  const handleEdit = (setup) => {
    setEditingSetup(setup);

    setForm({
      name: setup.name || "",
      description: setup.description || "",
      occasion: setup.occasion || "",
      is_available: setup.is_available,
      is_active: setup.is_active,
    });

    setImageFile(null);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE SETUP
  const handleDelete = async (setup) => {
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
      await loadSetups();

      if (editingSetup?.id === setup.id) {
        resetForm();
      }
    }
  };

  // FIX IMAGE PATHS
  const getSetupImage = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) return imageUrl;

    return `${import.meta.env.BASE_URL}${imageUrl.replace(/^\/+/, "")}`;
  };

  return (
    <section className="admin-surprises-section">
      <div className="admin-section-heading">
        <h2>Manage Surprise Setups ({setups.length})</h2>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadSetups}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh Setups
        </button>
      </div>

      {error && (
        <p className="admin-message admin-error">{error}</p>
      )}

      {success && (
        <p className="admin-message admin-success">{success}</p>
      )}

      {/* ADD / EDIT FORM */}
      <form
        className="admin-surprise-form"
        onSubmit={handleSubmit}
      >
        <h3>
          {editingSetup ? "Edit Surprise Setup" : "Add New Surprise Setup"}
        </h3>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label htmlFor="surprise-name">Setup Name *</label>
            <input
              id="surprise-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter setup name"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="surprise-occasion">Occasion *</label>
            <input
              id="surprise-occasion"
              name="occasion"
              value={form.occasion}
              onChange={handleChange}
              placeholder="e.g. Birthday Surprise"
              required
            />
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor="surprise-description">Description</label>
          <textarea
            id="surprise-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe this surprise setup..."
            rows="4"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="surprise-image">
            Setup Picture {editingSetup && "(Optional when editing)"}
          </label>

          <label
            className="admin-image-upload"
            htmlFor="surprise-image"
          >
            <Upload size={20} />
            <span>
              {imageFile
                ? imageFile.name
                : "Choose a surprise setup picture"}
            </span>
          </label>

          <input
            id="surprise-image"
            type="file"
            accept="image/*"
            hidden
            onChange={(event) =>
              setImageFile(event.target.files[0] || null)
            }
          />

          {editingSetup?.image_url && !imageFile && (
            <p className="admin-current-image">
              Current picture will be kept unless you choose another.
            </p>
          )}
        </div>

        <div className="admin-checkboxes">
          <label>
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
            />
            Available for Booking
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
              : editingSetup
                ? "Update Setup"
                : "Add Surprise Setup"}
          </button>

          {editingSetup && (
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

      {/* SETUP LIST */}
      <div className="admin-surprise-list-heading">
        <h3>Your Surprise Setups</h3>
      </div>

      {loading ? (
        <p className="admin-loading">Loading surprise setups...</p>
      ) : setups.length === 0 ? (
        <p className="admin-empty">
          No surprise setups have been added yet.
        </p>
      ) : (
        <div className="admin-surprise-grid">
          {setups.map((setup) => (
            <article className="admin-surprise-card" key={setup.id}>
              {setup.image_url ? (
                <img
                  src={getSetupImage(setup.image_url)}
                  alt={setup.name}
                  className="admin-surprise-image"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="admin-no-image">
                  No image uploaded
                </div>
              )}

              <div className="admin-surprise-info">
                <span className="admin-product-category">
                  {setup.occasion}
                </span>

                <h4>{setup.name}</h4>

                <p>{setup.description}</p>

                <div className="admin-product-status">
                  <span>
                    {setup.is_available ? "Available" : "Unavailable"}
                  </span>

                  <span>
                    {setup.is_active ? "Visible" : "Hidden"}
                  </span>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(setup)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDelete(setup)}
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
  );
}

export default SurpriseSetupManager;
